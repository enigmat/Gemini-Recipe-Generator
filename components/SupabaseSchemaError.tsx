import React, { useState } from 'react';
import ServerStackIcon from './icons/ServerStackIcon';
import CodeBracketIcon from './icons/CodeBracketIcon';
import ClipboardIcon from './icons/ClipboardIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

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
-- STEP 4: RECREATE ALL TABLES AND ROW-LEVEL SECURITY (RLS) POLICIES
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
CREATE POLICY "Allow individual user access to their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow individual user to update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Allow individual user to create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Create the user_data table
CREATE TABLE public.user_data (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    data JSONB
);
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow individual user access to their own data" ON public.user_data FOR ALL USING (auth.uid() = user_id);

-- Create all other application tables
CREATE TABLE public.recipes (
    id INTEGER PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB
);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to recipes" ON public.recipes FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to recipes" ON public.recipes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow anon to seed recipes if table is empty" ON public.recipes FOR INSERT TO anon WITH CHECK (public.is_recipes_table_empty());

CREATE TABLE public.new_recipes (
    id INTEGER PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB
);
ALTER TABLE public.new_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to new_recipes" ON public.new_recipes FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to new_recipes" ON public.new_recipes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow anon to seed new_recipes if table is empty" ON public.new_recipes FOR INSERT TO anon WITH CHECK (public.is_new_recipes_table_empty());

CREATE TABLE public.scheduled_recipes (
    id REAL PRIMARY KEY, title TEXT, image TEXT, description TEXT, cook_time TEXT, servings TEXT,
    ingredients JSONB, instructions TEXT[], calories TEXT, tags TEXT[], cuisine TEXT, wine_pairing JSONB, rating JSONB
);
ALTER TABLE public.scheduled_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to scheduled_recipes" ON public.scheduled_recipes FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to scheduled_recipes" ON public.scheduled_recipes FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE TABLE public.products (
    id TEXT PRIMARY KEY, name TEXT, brand TEXT, description TEXT, image_url TEXT, affiliate_url TEXT, category TEXT
);
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to products" ON public.products FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow anon to seed products if table is empty" ON public.products FOR INSERT TO anon WITH CHECK (public.is_products_table_empty());

CREATE TABLE public.sent_newsletters (
    id TEXT PRIMARY KEY, subject TEXT, message TEXT, recipe_ids INTEGER[], target TEXT, sent_date TEXT
);
ALTER TABLE public.sent_newsletters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow admin full access to sent_newsletters" ON public.sent_newsletters FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE TABLE public.leads ( email TEXT PRIMARY KEY, date_collected TEXT );
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow anon insert to leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow admin read access to leads" ON public.leads FOR SELECT USING (auth.role() = 'service_role');

CREATE TABLE public.ratings (
    recipe_id INTEGER PRIMARY KEY, total_score INTEGER, count INTEGER, user_ratings JSONB
);
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated read on ratings" ON public.ratings FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow admin full access to ratings" ON public.ratings FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

CREATE TABLE public.standard_cocktails (
    id TEXT PRIMARY KEY, title TEXT, description TEXT, image_prompt TEXT, glassware TEXT,
    garnish TEXT, ingredients TEXT[], instructions TEXT[], image TEXT
);
ALTER TABLE public.standard_cocktails ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to standard_cocktails" ON public.standard_cocktails FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to standard_cocktails" ON public.standard_cocktails FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow anon to seed standard_cocktails if table is empty" ON public.standard_cocktails FOR INSERT TO anon WITH CHECK (public.is_standard_cocktails_table_empty());

CREATE TABLE public.community_chat (
    id TEXT PRIMARY KEY, user_id TEXT, user_name TEXT, user_profile_image TEXT,
    is_admin BOOLEAN, text TEXT, "timestamp" TEXT
);
ALTER TABLE public.community_chat ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow authenticated users to read chat" ON public.community_chat FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated users to insert their own messages" ON public.community_chat FOR INSERT WITH CHECK (auth.email() = user_id);

CREATE TABLE public.about_us (
    id INTEGER PRIMARY KEY, company_name TEXT, mission_statement TEXT, company_history TEXT, contact_email TEXT, address TEXT
);
ALTER TABLE public.about_us ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access to about_us" ON public.about_us FOR SELECT USING (true);
CREATE POLICY "Allow admin full access to about_us" ON public.about_us FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Allow anon to seed about_us if table is empty" ON public.about_us FOR INSERT TO anon WITH CHECK (public.is_about_us_table_empty());


-- ---------------------------------------------------------------------
-- STEP 5: RECREATE FUNCTIONS AND TRIGGERS.
-- ---------------------------------------------------------------------

-- Specific, non-dynamic plpgsql functions to check if seedable tables are empty.
-- Using plpgsql and STABLE ensures the check is performed once per statement,
-- correctly handling bulk inserts for seeding.

CREATE OR REPLACE FUNCTION public.is_recipes_table_empty()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.recipes);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_recipes_table_empty() TO anon;

CREATE OR REPLACE FUNCTION public.is_new_recipes_table_empty()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.new_recipes);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_new_recipes_table_empty() TO anon;

CREATE OR REPLACE FUNCTION public.is_products_table_empty()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.products);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_products_table_empty() TO anon;

CREATE OR REPLACE FUNCTION public.is_standard_cocktails_table_empty()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.standard_cocktails);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_standard_cocktails_table_empty() TO anon;

CREATE OR REPLACE FUNCTION public.is_about_us_table_empty()
RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
BEGIN
  RETURN NOT EXISTS (SELECT 1 FROM public.about_us);
END;
$$;
GRANT EXECUTE ON FUNCTION public.is_about_us_table_empty() TO anon;


-- Function to create a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, name)
  VALUES (new.id, new.email, 'New User');
  RETURN new;
END;
$$;

-- Trigger to execute the function after a new user is created in auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

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

-- End of script
`;

const SupabaseSchemaError: React.FC = () => {
    const [copyButtonText, setCopyButtonText] = useState('Copy SQL Script');

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlSchema).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy SQL Script'), 2000);
        }, (err) => {
            console.error('Could not copy text: ', err);
            setCopyButtonText('Copy Failed');
            setTimeout(() => setCopyButtonText('Copy SQL Script'), 2000);
        });
    };

    return (
        <div className="bg-slate-100 min-h-screen flex items-center justify-center p-4">
            <div className="max-w-4xl w-full bg-white rounded-xl shadow-2xl p-8 border-t-8 border-blue-500">
                <div className="flex flex-col items-center text-center">
                    <ServerStackIcon className="w-16 h-16 text-blue-500" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Database Setup Required</h1>
                    <p className="text-lg text-slate-600 mt-2">
                        Your database is connected, but the required tables are missing or incomplete. Please run the provided SQL script to set up your database schema.
                    </p>
                </div>

                <div className="mt-8 space-y-6">
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                            <CodeBracketIcon className="w-6 h-6" />
                            Step 1: Go to the SQL Editor
                        </h2>
                        <p className="text-slate-600 mt-2">
                            In your Supabase project dashboard, navigate to the <strong className="text-slate-800">SQL Editor</strong> section.
                        </p>
                    </div>
                    
                    <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                        <h2 className="text-xl font-semibold text-slate-700 flex items-center gap-2">
                            <ClipboardIcon className="w-6 h-6" />
                            Step 2: Copy & Paste the Schema
                        </h2>
                        <p className="text-slate-600 mt-2">
                            Click the button below to copy the entire SQL script. This script will reset your tables to ensure a clean setup. Then, paste it into a new query in the Supabase SQL Editor.
                        </p>
                        <div className="mt-4 relative">
                             <pre className="bg-slate-800 text-white p-4 rounded-md text-xs overflow-x-auto max-h-40">
                                <code>{sqlSchema.substring(0, 400)}...</code>
                            </pre>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-slate-600 text-white text-xs font-semibold rounded-md hover:bg-slate-700"
                            >
                                {copyButtonText === 'Copied!' ? <CheckCircleIcon className="w-4 h-4" /> : <ClipboardIcon className="w-4 h-4" />}
                                {copyButtonText}
                            </button>
                        </div>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
                            <CheckCircleIcon className="w-6 h-6" />
                            Step 3: Run the Query
                        </h2>
                        <p className="text-green-800 mt-2">
                            Click the "RUN" button in the SQL Editor. Once it completes successfully, refresh this application page.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupabaseSchemaError;