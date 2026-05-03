-- Update profiles policies
ALTER POLICY "Users can view own profile" ON public.profiles USING ((SELECT auth.uid()) = id);
ALTER POLICY "Users can update own profile" ON public.profiles USING ((SELECT auth.uid()) = id);

-- Update quiz_sessions policies
ALTER POLICY "Users can manage own sessions" ON public.quiz_sessions USING ((SELECT auth.uid()) = user_id);

-- Update user_answers policies
ALTER POLICY "Users can manage own answers" ON public.user_answers USING ((SELECT auth.uid()) = user_id);

-- Update user_weak_topics policies
ALTER POLICY "Users can manage own weak topics" ON public.user_weak_topics USING ((SELECT auth.uid()) = user_id);

-- Update daily_rewards policies
ALTER POLICY "Users can view own rewards" ON public.daily_rewards USING ((SELECT auth.uid()) = user_id);
