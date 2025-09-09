-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('patient', 'attendant', 'manager');
CREATE TYPE public.channel_type AS ENUM ('whatsapp', 'instagram', 'facebook', 'email', 'phone', 'web_chat');
CREATE TYPE public.message_status AS ENUM ('sent', 'delivered', 'read', 'failed');
CREATE TYPE public.conversation_status AS ENUM ('open', 'assigned', 'resolved', 'closed');
CREATE TYPE public.appointment_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show');

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    role app_role NOT NULL DEFAULT 'patient',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create conversations table
CREATE TABLE public.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    attendant_id UUID REFERENCES public.profiles(id),
    channel channel_type NOT NULL,
    status conversation_status DEFAULT 'open',
    subject TEXT,
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create messages table
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.profiles(id),
    content TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    channel channel_type NOT NULL,
    status message_status DEFAULT 'sent',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create appointments table
CREATE TABLE public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    attendant_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    status appointment_status DEFAULT 'scheduled',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create medical_records table
CREATE TABLE public.medical_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    attendant_id UUID NOT NULL REFERENCES public.profiles(id),
    appointment_id UUID REFERENCES public.appointments(id),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    record_type TEXT DEFAULT 'consultation',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create performance_metrics table
CREATE TABLE public.performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attendant_id UUID NOT NULL REFERENCES public.profiles(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    conversations_handled INTEGER DEFAULT 0,
    average_response_time_minutes DECIMAL DEFAULT 0,
    resolved_conversations INTEGER DEFAULT 0,
    patient_satisfaction_score DECIMAL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(attendant_id, date)
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

-- Create function to check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = _role
  );
$$;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Attendants and managers can view all profiles" ON public.profiles
    FOR SELECT USING (
        public.get_current_user_role() IN ('attendant', 'manager')
    );

CREATE POLICY "Managers can insert profiles" ON public.profiles
    FOR INSERT WITH CHECK (public.has_role('manager'));

-- RLS Policies for conversations
CREATE POLICY "Patients can view their own conversations" ON public.conversations
    FOR SELECT USING (
        patient_id = auth.uid() OR 
        attendant_id = auth.uid() OR
        public.get_current_user_role() = 'manager'
    );

CREATE POLICY "Attendants can create conversations" ON public.conversations
    FOR INSERT WITH CHECK (
        public.get_current_user_role() IN ('attendant', 'manager')
    );

CREATE POLICY "Attendants can update conversations" ON public.conversations
    FOR UPDATE USING (
        attendant_id = auth.uid() OR 
        public.get_current_user_role() = 'manager'
    );

-- RLS Policies for messages
CREATE POLICY "Users can view messages from their conversations" ON public.messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id 
            AND (c.patient_id = auth.uid() OR c.attendant_id = auth.uid())
        ) OR public.get_current_user_role() = 'manager'
    );

CREATE POLICY "Users can send messages" ON public.messages
    FOR INSERT WITH CHECK (
        sender_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM public.conversations c 
            WHERE c.id = conversation_id 
            AND (c.patient_id = auth.uid() OR c.attendant_id = auth.uid())
        )
    );

-- RLS Policies for appointments
CREATE POLICY "Patients can view their own appointments" ON public.appointments
    FOR SELECT USING (
        patient_id = auth.uid() OR 
        attendant_id = auth.uid() OR
        public.get_current_user_role() = 'manager'
    );

CREATE POLICY "Attendants can create appointments" ON public.appointments
    FOR INSERT WITH CHECK (
        public.get_current_user_role() IN ('attendant', 'manager')
    );

CREATE POLICY "Attendants can update appointments" ON public.appointments
    FOR UPDATE USING (
        attendant_id = auth.uid() OR 
        public.get_current_user_role() = 'manager'
    );

-- RLS Policies for medical_records
CREATE POLICY "Patients can view their own records" ON public.medical_records
    FOR SELECT USING (
        patient_id = auth.uid() OR 
        attendant_id = auth.uid() OR
        public.get_current_user_role() = 'manager'
    );

CREATE POLICY "Attendants can create records" ON public.medical_records
    FOR INSERT WITH CHECK (
        attendant_id = auth.uid() AND
        public.get_current_user_role() IN ('attendant', 'manager')
    );

CREATE POLICY "Attendants can update their records" ON public.medical_records
    FOR UPDATE USING (
        attendant_id = auth.uid() OR 
        public.get_current_user_role() = 'manager'
    );

-- RLS Policies for performance_metrics
CREATE POLICY "Attendants can view their own metrics" ON public.performance_metrics
    FOR SELECT USING (
        attendant_id = auth.uid() OR 
        public.get_current_user_role() = 'manager'
    );

CREATE POLICY "System can insert metrics" ON public.performance_metrics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "System can update metrics" ON public.performance_metrics
    FOR UPDATE USING (true);

-- RLS Policies for audit_logs
CREATE POLICY "Managers can view all audit logs" ON public.audit_logs
    FOR SELECT USING (public.has_role('manager'));

CREATE POLICY "System can insert audit logs" ON public.audit_logs
    FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.email,
    COALESCE((NEW.raw_user_meta_data ->> 'role')::app_role, 'patient')
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at columns
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at
    BEFORE UPDATE ON public.medical_records
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_performance_metrics_updated_at
    BEFORE UPDATE ON public.performance_metrics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_role ON public.profiles(role);
CREATE INDEX idx_conversations_patient ON public.conversations(patient_id);
CREATE INDEX idx_conversations_attendant ON public.conversations(attendant_id);
CREATE INDEX idx_conversations_status ON public.conversations(status);
CREATE INDEX idx_messages_conversation ON public.messages(conversation_id);
CREATE INDEX idx_messages_sender ON public.messages(sender_id);
CREATE INDEX idx_appointments_patient ON public.appointments(patient_id);
CREATE INDEX idx_appointments_attendant ON public.appointments(attendant_id);
CREATE INDEX idx_appointments_scheduled_at ON public.appointments(scheduled_at);
CREATE INDEX idx_medical_records_patient ON public.medical_records(patient_id);
CREATE INDEX idx_performance_metrics_attendant_date ON public.performance_metrics(attendant_id, date);