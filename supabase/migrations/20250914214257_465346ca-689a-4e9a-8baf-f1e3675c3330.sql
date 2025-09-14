-- Allow patients to create their own conversations
DROP POLICY IF EXISTS "Attendants can create conversations" ON public.conversations;

CREATE POLICY "Users can create conversations" 
ON public.conversations 
FOR INSERT 
WITH CHECK (
  -- Patients can create conversations where they are the patient
  (auth.uid() = patient_id AND get_current_user_role() = 'patient'::app_role) OR
  -- Attendants and managers can create any conversation
  (get_current_user_role() = ANY (ARRAY['attendant'::app_role, 'manager'::app_role]))
);