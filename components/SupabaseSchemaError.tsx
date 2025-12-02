
import React, { useState } from 'react';
import ServerStackIcon from './icons/ServerStackIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import ExternalLinkIcon from './icons/ExternalLinkIcon';
import ChevronRightIcon from './icons/ChevronRightIcon';
import ChevronLeftIcon from './icons/ChevronLeftIcon';
import CheckIcon from './icons/CheckIcon';
import { getSupabaseClient } from '../services/supabaseClient';
import Spinner from './Spinner';

const sqlSchema = `--
-- ULTIMATE RESET SCRIPT - Drop and recreate the entire 'public' schema.
-- WARNING: THIS DELETES ALL DATA IN YOUR PUBLIC SCHEMA.
--
-- How to use:
-- 1. Go to your Supabase project dashboard -> SQL Editor.
-- 2. Click "New query".
-- 3. Copy and paste this ENTIRE script into the editor.
-- 4. Click "RUN".
-- 5. After it succeeds, refresh the application.
--

-- ----------------------------------------------------
-- STEP 1: DROP OBJECTS OUTSIDE THE 'public' SCHEMA
-- The trigger on auth.users must be dropped before the schema it references.
-- ----------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- ----------------------------------------------------
-- STEP 2: NUKE THE ENTIRE 'public' SCHEMA
-- This is the most forceful way to reset. It drops all tables, functions, etc.
-- ----------------------------------------------------
DROP SCHEMA IF EXISTS public CASCADE;

-- ----------------------------------------------------
-- STEP 3: RECREATE THE 'public' SCHEMA AND RESTORE PERMISSIONS
-- ----------------------------------------------------
CREATE SCHEMA public;
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- STEP 4: RECREATE ALL TABLES
-- ---------------------------------------------------------------------

-- Create the user_profiles table
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE,
    name TEXT,
    profile_image TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE,
    is_subscribed BOOLEAN DEFAULT FALSE,
    plan_end_date TEXT,
    food_preferences TEXT[]
);
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create the user_data table
CREATE TABLE public.user_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB
);
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- Create all other application tables
-- Using BIGINT for IDs to support Date.now() which exceeds standard INTEGER range
CREATE TABLE public.recipes (
    id BIGINT PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB, chef JSONB
);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.new_recipes (
    id BIGINT PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB, chef JSONB
);
ALTER TABLE public.new_recipes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.scheduled_recipes (
    id DOUBLE PRECISION PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB, chef JSONB
);
ALTER TABLE public.scheduled_recipes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.products (
    id TEXT PRIMARY KEY, name TEXT, brand TEXT, description TEXT, image_url TEXT, affiliate_url TEXT, category TEXT
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.sent_newsletters (
    id TEXT PRIMARY KEY, subject TEXT, message TEXT, recipe_ids BIGINT[], target TEXT, sent_date TEXT
);
ALTER TABLE public.sent_newsletters ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.leads ( email TEXT PRIMARY KEY, date_collected TEXT );
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.ratings (
    recipe_id BIGINT PRIMARY KEY, total_score INTEGER, count INTEGER, user_ratings JSONB
);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.standard_cocktails (
    id TEXT PRIMARY KEY, title TEXT, description TEXT, image_prompt TEXT, glassware TEXT,
    garnish TEXT, ingredients TEXT[], instructions TEXT[], image TEXT
);
ALTER TABLE public.standard_cocktails ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.community_chat (
    id TEXT PRIMARY KEY, user_id TEXT, user_name TEXT, user_profile_image TEXT,
    is_admin BOOLEAN, text TEXT, "timestamp" TEXT
);
ALTER TABLE public.community_chat ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.about_us (
    id INTEGER PRIMARY KEY, company_name TEXT, mission_statement TEXT, company_history TEXT, contact_email TEXT, address TEXT
);
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.meal_plans (
    id TEXT PRIMARY KEY, title TEXT, description TEXT, recipe_ids BIGINT[]
);
ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.videos (
    id TEXT PRIMARY KEY, category TEXT, title TEXT, description TEXT, video_url TEXT, thumbnail_url TEXT
);
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.cooking_classes (
    id TEXT PRIMARY KEY, title TEXT, description TEXT, chef TEXT, thumbnail_url TEXT,
    steps JSONB, what_you_will_learn TEXT[], techniques_covered TEXT[], pro_tips TEXT[]
);
ALTER TABLE public.cooking_classes ENABLE ROW LEVEL SECURITY;

CREATE TABLE public.expert_questions (
    id TEXT PRIMARY KEY, question TEXT, topic TEXT, status TEXT, submitted_date TEXT, answer JSONB
);
ALTER TABLE public.expert_questions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- STEP 5: RECREATE FUNCTIONS.
-- ---------------------------------------------------------------------

-- Function to create a profile when a new user signs up.
-- The first user to sign up automatically becomes an admin.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count integer;
BEGIN
  -- Check if any user already exists in the auth schema
  SELECT count(*) INTO user_count FROM auth.users;

  -- If this is the very first user (count will be 1), make them an admin.
  IF user_count = 1 THEN
    INSERT INTO public.user_profiles (id, email, name, is_admin)
    VALUES (new.id, new.email, 'Admin User', TRUE);
  ELSE
    INSERT INTO public.user_profiles (id, email, name, is_admin)
    VALUES (new.id, new.email, 'New User', FALSE);
  END IF;
  
  RETURN new;
END;
$$;

-- RPC fallback function to ensure a profile exists if the trigger fails for any reason
CREATE OR REPLACE FUNCTION public.get_or_create_user_profile(dummy_param TEXT)
RETURNS json
LANGUAGE plpgsql
SECURITY INVOKER SET search_path = public
AS $$
DECLARE
    profile_record record;
BEGIN
    INSERT INTO public.user_profiles (id, email, name)
    VALUES (auth.uid(), auth.email(), 'New User')
    ON CONFLICT (id) DO NOTHING;

    SELECT * INTO profile_record FROM public.user_profiles WHERE id = auth.uid();

    RETURN json_build_object(
      'id', profile_record.id,
      'email', profile_record.email,
      'name', profile_record.name,
      'profileImage', profile_record.profile_image,
      'isPremium', profile_record.is_premium,
      'isAdmin', profile_record.is_admin,
      'isSubscribed', profile_record.is_subscribed,
      'planEndDate', profile_record.plan_end_date,
      'foodPreferences', profile_record.food_preferences
    );
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_or_create_user_profile(TEXT) TO authenticated;

-- Function to check if the current user has the 'admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  RETURN COALESCE((SELECT is_admin FROM public.user_profiles WHERE id = auth.uid()), FALSE);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;


-- ---------------------------------------------------------------------
-- STEP 6: CREATE ROW-LEVEL SECURITY (RLS) POLICIES
-- ---------------------------------------------------------------------

CREATE POLICY "Allow individual user access to their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual user to update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual user to create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow individual user access to their own data" ON public.user_data FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow public read access to recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed recipes" ON public.recipes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admins full access" ON public.recipes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Allow public read access to new_recipes" ON public.new_recipes FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed new_recipes" ON public.new_recipes FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admins full access" ON public.new_recipes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Allow public read access to scheduled_recipes" ON public.scheduled_recipes FOR SELECT USING (true);
CREATE POLICY "Allow admins full access" ON public.scheduled_recipes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed products" ON public.products FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admins full access" ON public.products FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- No policies for sent_newsletters by default, only service_role can access

CREATE POLICY "Allow anon insert to leads" ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read on ratings" ON public.ratings FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow public read access to standard_cocktails" ON public.standard_cocktails FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed standard_cocktails" ON public.standard_cocktails FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Allow admins full access" ON public.standard_cocktails FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Allow authenticated users to read chat" ON public.community_chat FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert their own messages" ON public.community_chat FOR INSERT WITH CHECK (auth.email() = user_id);

CREATE POLICY "Allow public read access to about_us" ON public.about_us FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed about_us" ON public.about_us FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read access to meal_plans" ON public.meal_plans FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed meal_plans" ON public.meal_plans FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read access to videos" ON public.videos FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed videos" ON public.videos FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read access to cooking_classes" ON public.cooking_classes FOR SELECT USING (true);
CREATE POLICY "Allow anon to seed cooking_classes" ON public.cooking_classes FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow public read access to expert_questions" ON public.expert_questions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated users to insert questions" ON public.expert_questions FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow anon to seed expert_questions" ON public.expert_questions FOR INSERT TO anon WITH CHECK (true);

-- ---------------------------------------------------------------------
-- STEP 7: RECREATE TRIGGERS.
-- ---------------------------------------------------------------------

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- End of script
`;

const StepIndicator = ({ current, total }: { current: number, total: number }) => (
    <div className="flex items-center justify-center">
        {Array.from({ length: total }).map((_, index) => {
            const step = index + 1;
            const isCompleted = step < current;
            const isCurrent = step === current;
            return (
                <React.Fragment key={step}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors duration-300 ${
                        isCurrent ? 'bg-blue-500 text-white ring-4 ring-blue-200' : isCompleted ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                    }`}>
                        {isCompleted ? <CheckIcon className="w-6 h-6" /> : step}
                    </div>
                    {step < total && <div className={`flex-1 h-1 transition-colors duration-300 ${isCompleted ? 'bg-green-500' : 'bg-slate-200'}`}></div>}
                </React.Fragment>
            )
        })}
    </div>
);

const Step1 = ({ onNext }: { onNext: () => void }) => (
  <div className="text-center animate-fade-in">
    <h2 className="text-xl font-semibold text-slate-700 flex items-center justify-center gap-2">
      <ExternalLinkIcon className="w-6 h-6" />
      Open Supabase
    </h2>
    <p className="text-slate-600 mt-2">
      First, open your Supabase project dashboard in a new tab. You'll need to find the <strong>SQL Editor</strong>.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
       <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-bold rounded-lg shadow-md hover:bg-green-700 transition-colors">
            Open Supabase Dashboard
       </a>
       <button onClick={onNext} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors">
            Next Step <ChevronRightIcon className="w-5 h-5" />
       </button>
    </div>
  </div>
);

const Step2 = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
    const [copyButtonText, setCopyButtonText] = useState('Copy Script');

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlSchema).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => {
                onNext();
                // Reset for next time
                setTimeout(() => setCopyButtonText('Copy Script'), 500);
            }, 1000);
        }, () => {
            setCopyButtonText('Copy Failed');
            setTimeout(() => setCopyButtonText('Copy Script'), 2000);
        });
    };
    return (
      <div className="animate-fade-in">
        <h2 className="text-xl font-semibold text-slate-700 flex items-center justify-center gap-2 mb-2">
            <ClipboardIcon className="w-6 h-6" />
            Copy the Setup Script
        </h2>
        <p className="text-slate-600 mt-2 text-center">Click the button below to copy the entire script. It will reset your database to ensure a clean setup.</p>
        <div className="mt-4 text-center">
            <button
                onClick={handleCopy}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-slate-700 text-white font-bold rounded-lg shadow-md hover:bg-slate-800 transition-colors"
            >
                {copyButtonText === 'Copied!' ? <CheckCircleIcon className="w-6 h-6" /> : <ClipboardIcon className="w-6 h-6" />}
                {copyButtonText}
            </button>
        </div>
        <div className="mt-6 flex justify-center">
            <button onClick={onBack} className="inline-flex items-center gap-2 px-4 py-2 bg-transparent text-slate-600 font-semibold rounded-lg hover:bg-slate-200 transition-colors">
                <ChevronLeftIcon className="w-5 h-5" /> Back
            </button>
        </div>
      </div>
    );
};

const Step3 = ({ onNext, onBack }: { onNext: () => void, onBack: () => void }) => {
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleVerify = async () => {
        setIsVerifying(true);
        setError(null);
        try {
            const supabase = getSupabaseClient();
            // Try to select from the recipes table to see if it exists
            const { error: dbError } = await supabase.from('recipes').select('count', { count: 'exact', head: true });
            
            if (dbError) {
                // If code is still 42P01 (undefined table), it means script wasn't run or failed
                if (dbError.code === '42P01') {
                    throw new Error("Tables are still missing. Please make sure you ran the entire script successfully in Supabase.");
                } else {
                    throw new Error(`Verification failed: ${dbError.message}`);
                }
            }
            // If no error, success!
            onNext();
        } catch (e: any) {
            console.error("Verification error:", e);
            setError(e.message);
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="text-center animate-fade-in">
            <h2 className="text-xl font-semibold text-slate-700 flex items-center justify-center gap-2">
                Paste and Run
            </h2>
            <p className="text-slate-600 mt-2 max-w-xl mx-auto">
                In the Supabase SQL Editor, click <strong>"+ New query"</strong>, paste the script you just copied, and click the green <strong>"RUN"</strong> button.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <button onClick={onBack} className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-700 font-bold rounded-lg shadow-md border hover:bg-slate-100 transition-colors">
                    <ChevronLeftIcon className="w-5 h-5" /> Back
                </button>
                <button 
                    onClick={handleVerify} 
                    disabled={isVerifying}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white font-bold rounded-lg shadow-md hover:bg-blue-600 transition-colors disabled:bg-blue-300"
                >
                    {isVerifying ? <Spinner /> : <CheckCircleIcon className="w-5 h-5" />}
                    <span>{isVerifying ? 'Verifying...' : "I've Run the Script"}</span>
                </button>
            </div>
            {error && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
                    {error}
                </div>
            )}
        </div>
    );
};

const Step4 = () => (
    <div className="text-center animate-fade-in">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto" />
        <h2 className="text-2xl font-semibold text-slate-700 mt-4">
            Setup Complete!
        </h2>
        <p className="text-slate-600 mt-2">
            Your database is ready. Click the button below to launch the application.
        </p>
        <div className="mt-6 flex justify-center">
            <button onClick={() => window.location.reload()} className="inline-flex items-center gap-2 px-8 py-3 bg-green-500 text-white font-bold rounded-lg shadow-md hover:bg-green-600 transition-colors">
                Reload Application
            </button>
        </div>
    </div>
);

const SupabaseSchemaError: React.FC = () => {
    const [step, setStep] = useState(1);

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1 onNext={() => setStep(2)} />;
            case 2: return <Step2 onNext={() => setStep(3)} onBack={() => setStep(1)} />;
            case 3: return <Step3 onNext={() => setStep(4)} onBack={() => setStep(2)} />;
            case 4: return <Step4 />;
            default: return <Step1 onNext={() => setStep(2)} />;
        }
    };
    
    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-white rounded-xl shadow-2xl p-6 sm:p-8 border-t-8 border-blue-500">
                <div className="flex flex-col items-center text-center">
                    <ServerStackIcon className="w-16 h-16 text-blue-500" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Database Setup Required</h1>
                    <p className="text-lg text-slate-600 mt-2">
                        Your database is connected, but the tables are missing. Let's fix that.
                    </p>
                </div>

                <div className="mt-8">
                    <div className="px-4 sm:px-8">
                        <StepIndicator current={step} total={4} />
                    </div>
                    <div className="mt-6 bg-slate-50 p-6 rounded-lg border border-slate-200 min-h-[15rem] flex flex-col justify-center">
                        {renderStep()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupabaseSchemaError;
