--
-- PostgreSQL database dump
--

-- Dumped from database version 15.10 (Homebrew)
-- Dumped by pg_dump version 15.10 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: jayaraj
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO jayaraj;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: jayaraj
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AuditAction; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."AuditAction" AS ENUM (
    'CREATE',
    'UPDATE',
    'DELETE',
    'RESTORE',
    'STATUS_CHANGE'
);


ALTER TYPE public."AuditAction" OWNER TO jayaraj;

--
-- Name: BusinessActionStatus; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."BusinessActionStatus" AS ENUM (
    'ACTIVE',
    'COMPLETED',
    'ARCHIVED'
);


ALTER TYPE public."BusinessActionStatus" OWNER TO jayaraj;

--
-- Name: EntityType; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."EntityType" AS ENUM (
    'APP_USER',
    'TEAM_FUNCTION',
    'JOB_TITLE',
    'JOB_GRADE',
    'BUSINESS_ACTION',
    'G_TEAM',
    'TEAM_MEMBER',
    'MEMBER_SCORE',
    'STRUCTURED_FEEDBACK',
    'MEMBER_COMMENT',
    'PERFORMANCE_REVIEW'
);


ALTER TYPE public."EntityType" OWNER TO jayaraj;

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."Priority" AS ENUM (
    'LOW',
    'MEDIUM',
    'HIGH'
);


ALTER TYPE public."Priority" OWNER TO jayaraj;

--
-- Name: ReviewStatus; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."ReviewStatus" AS ENUM (
    'DRAFT',
    'PUBLISHED',
    'ACKNOWLEDGED'
);


ALTER TYPE public."ReviewStatus" OWNER TO jayaraj;

--
-- Name: SubscriptionTier; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."SubscriptionTier" AS ENUM (
    'FREE',
    'PREMIUM',
    'ENTERPRISE'
);


ALTER TYPE public."SubscriptionTier" OWNER TO jayaraj;

--
-- Name: TeamMemberStatus; Type: TYPE; Schema: public; Owner: jayaraj
--

CREATE TYPE public."TeamMemberStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ONLEAVE'
);


ALTER TYPE public."TeamMemberStatus" OWNER TO jayaraj;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO jayaraj;

--
-- Name: action_categories; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.action_categories (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.action_categories OWNER TO jayaraj;

--
-- Name: actions; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.actions (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    "impactScale" smallint,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.actions OWNER TO jayaraj;

--
-- Name: app_users; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.app_users (
    id text NOT NULL,
    email character varying(255) NOT NULL,
    name character varying(100),
    "clerkId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb,
    "subscriptionEnd" timestamp(3) without time zone,
    "subscriptionStart" timestamp(3) without time zone,
    "subscriptionTier" public."SubscriptionTier" DEFAULT 'FREE'::public."SubscriptionTier" NOT NULL
);


ALTER TABLE public.app_users OWNER TO jayaraj;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.audit_logs (
    id text NOT NULL,
    action public."AuditAction" NOT NULL,
    "entityType" public."EntityType" NOT NULL,
    "entityId" text NOT NULL,
    changes jsonb NOT NULL,
    "performedBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO jayaraj;

--
-- Name: g_teams; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.g_teams (
    id text NOT NULL,
    name character varying(200) NOT NULL,
    description text,
    "teamFunctionId" text NOT NULL,
    "ownerId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb
);


ALTER TABLE public.g_teams OWNER TO jayaraj;

--
-- Name: job_grades; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.job_grades (
    id text NOT NULL,
    level integer NOT NULL,
    grade character varying(50) NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb,
    "typicalResponsibilities" text
);


ALTER TABLE public.job_grades OWNER TO jayaraj;

--
-- Name: job_titles; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.job_titles (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    "teamFunctionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb
);


ALTER TABLE public.job_titles OWNER TO jayaraj;

--
-- Name: member_comments; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.member_comments (
    id text NOT NULL,
    content character varying(2000) NOT NULL,
    "teamMemberId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.member_comments OWNER TO jayaraj;

--
-- Name: member_scores; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.member_scores (
    id text NOT NULL,
    value smallint NOT NULL,
    "teamMemberId" text NOT NULL,
    "actionId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.member_scores OWNER TO jayaraj;

--
-- Name: org_actions; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.org_actions (
    id text NOT NULL,
    "actionId" text NOT NULL,
    priority public."Priority" DEFAULT 'MEDIUM'::public."Priority" NOT NULL,
    status public."BusinessActionStatus" DEFAULT 'ACTIVE'::public."BusinessActionStatus" NOT NULL,
    "dueDate" timestamp(3) without time zone,
    "teamId" text NOT NULL,
    "createdBy" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb
);


ALTER TABLE public.org_actions OWNER TO jayaraj;

--
-- Name: org_name; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.org_name (
    id text NOT NULL,
    name text NOT NULL,
    "userId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.org_name OWNER TO jayaraj;

--
-- Name: performance_reviews; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.performance_reviews (
    id text NOT NULL,
    quarter smallint NOT NULL,
    year integer NOT NULL,
    content text NOT NULL,
    status public."ReviewStatus" DEFAULT 'DRAFT'::public."ReviewStatus" NOT NULL,
    version integer DEFAULT 1 NOT NULL,
    "teamMemberId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customFields" jsonb
);


ALTER TABLE public.performance_reviews OWNER TO jayaraj;

--
-- Name: structured_feedback; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.structured_feedback (
    id text NOT NULL,
    strengths text[],
    improvements text[],
    goals text[],
    "teamMemberId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "customFields" jsonb
);


ALTER TABLE public.structured_feedback OWNER TO jayaraj;

--
-- Name: team_functions; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.team_functions (
    id text NOT NULL,
    name character varying(100) NOT NULL,
    description character varying(500),
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb
);


ALTER TABLE public.team_functions OWNER TO jayaraj;

--
-- Name: team_members; Type: TABLE; Schema: public; Owner: jayaraj
--

CREATE TABLE public.team_members (
    id text NOT NULL,
    "userId" text NOT NULL,
    "teamId" text NOT NULL,
    title character varying(100),
    "isAdmin" boolean DEFAULT false NOT NULL,
    status public."TeamMemberStatus" DEFAULT 'ACTIVE'::public."TeamMemberStatus" NOT NULL,
    "firstName" character varying(50),
    "lastName" character varying(50),
    "photoUrl" text,
    "joinedDate" timestamp(3) without time zone,
    "jobGradeId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "deletedAt" timestamp(3) without time zone,
    "customFields" jsonb
);


ALTER TABLE public.team_members OWNER TO jayaraj;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
0b2e3664-842d-4a3c-816f-b5c9c0ed4b00	ce2300cc5d2bec214e9a15ba1dec1632da70193644889a06f08dcb31cce881e9	2025-02-27 18:41:29.338903+05:30	20250117090634_init	\N	\N	2025-02-27 18:41:29.321619+05:30	1
574d3c03-42ce-4296-af9e-2fe3e18c6555	f1d195841f249fade23e17d825b903f659930caa59575d7deaa837511978b9dc	2025-02-27 18:41:29.360223+05:30	20250117144754_add_discipline_and_activities	\N	\N	2025-02-27 18:41:29.339464+05:30	1
e08dd009-c3f6-4f71-a04d-182178f3142f	4dd1cc9262b307ba149fafeacc238973547ff5b54d06ca90042f02e8e7bb99f8	2025-02-27 18:41:29.362783+05:30	20250118090013_add_initiatives_relation	\N	\N	2025-02-27 18:41:29.36058+05:30	1
ad192bf0-2664-4dfa-a9ec-950d03711c60	cbd8004c497cbe75141399f245e2b7247e89177d58b5125918be4f7eb90d3bb5	2025-02-27 18:41:29.382394+05:30	20250118173139_gteam_db	\N	\N	2025-02-27 18:41:29.36325+05:30	1
a175b484-5d1d-4943-9279-458ec9e026da	ad7c9ee1aa1a070f0f3327ef121191d094be10365b3b2a5f7315233280581b8e	2025-02-27 18:41:29.401316+05:30	20250118173933_gteamdb	\N	\N	2025-02-27 18:41:29.382813+05:30	1
16c1a668-6807-4efa-8018-f32009519779	6ac31eb1ab7fb2919940ea79336d8af32fe6f9b88a2ce7b30d78e468257e1776	2025-02-27 18:41:29.402482+05:30	20250121140350_add_feedback_to_member_rating	\N	\N	2025-02-27 18:41:29.401571+05:30	1
e6529cd3-6398-4970-8993-5ca6470978e1	1c597f392fa79ce02fd27158486cca4dc6cbfbfe58ef99ca6ad785b280b9c7df	2025-02-27 18:41:29.403745+05:30	20250203163207_add_subscription_fields	\N	\N	2025-02-27 18:41:29.402678+05:30	1
18460c5f-7d49-422c-9286-973676041bcf	d1cbf535c1a6298110e9edcf83115d69037ba75ff6baa71d61d624783ba7589b	2025-02-27 18:41:29.40706+05:30	20250218012121_add_activity_table	\N	\N	2025-02-27 18:41:29.403948+05:30	1
d485b9c7-269b-460f-aed7-13bfa03a045f	9707af47f52b7d2f1e56c72ac58749fb3eb59b4bc4372db3fee84c95f917c735	2025-02-27 18:41:29.408065+05:30	20250220035143_business_activity_updates	\N	\N	2025-02-27 18:41:29.407277+05:30	1
9c6c2517-8ddf-40a6-a7ad-45ccaef4fd4c	6476452fc642b8cd7b8eb6e8d77919c5d64f27dc484121b9ac8832a83bb78449	2025-02-27 18:41:29.409767+05:30	20250227121939_update_schema_orgname	\N	\N	2025-02-27 18:41:29.408243+05:30	1
c06c70b3-f116-4957-b424-82a891c3c72c	824924c38dab161fa910d0d92a0c85658f97dd9f2eff531e962fd2ed2d3531a4	2025-02-27 18:41:29.420122+05:30	20250227125159_	\N	\N	2025-02-27 18:41:29.410008+05:30	1
\.


--
-- Data for Name: action_categories; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.action_categories (id, name, description, "createdAt", "updatedAt") FROM stdin;
cm7nd5atu00025n7jczacmikq	Cultural Behaviours & Values	Activities related to company culture and values	2025-02-27 13:11:30.835	2025-02-27 13:11:30.835
cm7nd5au5000n5n7jhc6x2khk	Customer Centricity	Focusing on customer needs and experience	2025-02-27 13:11:30.845	2025-02-27 13:11:30.845
cm7nd5au900185n7j5qozgig9	Teamwork	Collaboration and effective team participation	2025-02-27 13:11:30.849	2025-02-27 13:11:30.849
cm7nd5aud001t5n7jr5iix9ym	Leadership	Activities related to leadership and guiding teams	2025-02-27 13:11:30.853	2025-02-27 13:11:30.853
cm7nd5auh002e5n7j8vsjabh1	Team Management	Activities focused on managing team performance and development	2025-02-27 13:11:30.858	2025-02-27 13:11:30.858
cm7nd5aum002z5n7j81aw79dt	Engineering	Activities related to software engineering and development	2025-02-27 13:11:30.862	2025-02-27 13:11:30.862
cm7nd5aup003k5n7jyspvr0ku	Product	Activities related to product management and development	2025-02-27 13:11:30.866	2025-02-27 13:11:30.866
cm7nd5aut00455n7jrp16j4im	Design & UX	Activities related to design and user experience	2025-02-27 13:11:30.869	2025-02-27 13:11:30.869
cm7nd5auz004q5n7jleqamrj4	Marketing	Activities related to marketing and brand promotion	2025-02-27 13:11:30.875	2025-02-27 13:11:30.875
cm7nd5av4005b5n7jkd2snoxh	Data & Analytics	Activities related to data analysis and insights	2025-02-27 13:11:30.88	2025-02-27 13:11:30.88
cm7nd5av7005w5n7jh0sxg4c4	Customer Success & Support	Activities related to customer success and support	2025-02-27 13:11:30.884	2025-02-27 13:11:30.884
cm7nd5avb006h5n7jtu77jlx6	Finance	Activities related to financial management	2025-02-27 13:11:30.888	2025-02-27 13:11:30.888
cm7nd5avf00725n7jvdd3dhxj	Legal	Activities related to legal and compliance matters	2025-02-27 13:11:30.892	2025-02-27 13:11:30.892
cm7nd5avj007n5n7j1mewouii	Human Resources	Activities related to human resources and talent management	2025-02-27 13:11:30.895	2025-02-27 13:11:30.895
cm7nd5avm00885n7jolp9ciel	IT & Security	Activities related to IT infrastructure and security	2025-02-27 13:11:30.899	2025-02-27 13:11:30.899
cm7nd5avq008t5n7jwybev4xy	Research	Activities related to research and development	2025-02-27 13:11:30.902	2025-02-27 13:11:30.902
cm7nd5avt009e5n7jokvvkmd7	Operations	Activities related to business operations and processes	2025-02-27 13:11:30.905	2025-02-27 13:11:30.905
cm7nd5avw009z5n7jujg1y8nn	Education	Activities related to training and education	2025-02-27 13:11:30.909	2025-02-27 13:11:30.909
\.


--
-- Data for Name: actions; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.actions (id, name, description, "impactScale", "categoryId", "createdAt", "updatedAt") FROM stdin;
cm7nd5atw00045n7jilen7b0k	Embraced transparency	Embraced transparency and honesty in all interactions.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.836	2025-02-27 13:11:30.836
cm7nd5aty00065n7j9rmyx9yi	Valued diversity	Valued diversity by promoting inclusive and equitable practices.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.839	2025-02-27 13:11:30.839
cm7nd5au000085n7jydhm6yzs	Modeled respect	Modeled respect and kindness toward all colleagues.	3	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.84	2025-02-27 13:11:30.84
cm7nd5au1000a5n7jazqln06q	Practiced empathy	Practiced empathy and actively listened to different perspectives.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.841	2025-02-27 13:11:30.841
cm7nd5au2000c5n7jj91u805w	Encouraged open dialogue	Encouraged open dialogue and constructive feedback.	3	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.842	2025-02-27 13:11:30.842
cm7nd5au2000e5n7j2ehze10g	Demonstrated growth mindset	Demonstrated a growth mindset and willingness to learn.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.843	2025-02-27 13:11:30.843
cm7nd5au3000g5n7jwize9vl0	Took responsibility	Took responsibility for mistakes and learned from them.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.843	2025-02-27 13:11:30.843
cm7nd5au3000i5n7j2f6kgyz1	Supported work-life balance	Supported work-life balance and mental well-being.	3	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.844	2025-02-27 13:11:30.844
cm7nd5au4000k5n7juvb07eqe	Celebrated successes	Celebrated successes and shared credit within the team.	3	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.844	2025-02-27 13:11:30.844
cm7nd5au4000m5n7jqdwgf17p	Aligned with values	Aligned personal actions with core organizational values.	4	cm7nd5atu00025n7jczacmikq	2025-02-27 13:11:30.845	2025-02-27 13:11:30.845
cm7nd5au5000p5n7jmxry77qd	Customer advocacy	Regularly advocated for customer interests in cross-functional meetings and decision-making.	5	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.846	2025-02-27 13:11:30.846
cm7nd5au6000r5n7jhq6q56af	Journey mapping	Analyzed customer journey maps to propose improvements in internal processes and policies.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.846	2025-02-27 13:11:30.846
cm7nd5au6000t5n7jhqfaqhtx	Empathy sessions	Facilitated empathy sessions, sharing real customer stories to align teams on user needs.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.846	2025-02-27 13:11:30.846
cm7nd5au6000v5n7j9uz3qrzq	User pain resolution	Influenced product or service updates by translating user pain points into actionable suggestions.	5	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.847	2025-02-27 13:11:30.847
cm7nd5au7000x5n7jjprk1klq	Feedback loop	Encouraged a transparent feedback loop, ensuring customers felt heard and valued.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.847	2025-02-27 13:11:30.847
cm7nd5au7000z5n7jjzfg8izc	End-user accountability	Promoted a culture of accountability for any impact on the end-user experience.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.848	2025-02-27 13:11:30.848
cm7nd5au700115n7j5ctkci1m	Trend identification	Identified emerging trends and forecasted evolving customer expectations.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.848	2025-02-27 13:11:30.848
cm7nd5au800135n7jtuvls64z	Friction elimination	Collaborated with multiple teams to eliminate friction points throughout the customer lifecycle.	5	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.848	2025-02-27 13:11:30.848
cm7nd5au800155n7jb2zlnlcr	Operational improvements	Led discussions on how operational changes could enhance customer satisfaction.	4	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.849	2025-02-27 13:11:30.849
cm7nd5au900175n7jgb40lsal	Impact tracking	Tracked and communicated the tangible impact of customer-centric initiatives to the organization.	3	cm7nd5au5000n5n7jhc6x2khk	2025-02-27 13:11:30.849	2025-02-27 13:11:30.849
cm7nd5au9001a5n7jlqezog2n	Active participation	Actively participated in group tasks to reach shared goals.	3	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.85	2025-02-27 13:11:30.85
cm7nd5aua001c5n7jq5f3bpra	Open communication	Communicated openly to prevent misunderstandings or delays.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.85	2025-02-27 13:11:30.85
cm7nd5aua001e5n7j1arh663a	Solution contribution	Contributed ideas and solutions during team problem-solving sessions.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.851	2025-02-27 13:11:30.851
cm7nd5aub001g5n7jevxn2k4s	Feedback integration	Respected diverse viewpoints and integrated feedback effectively.	3	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.851	2025-02-27 13:11:30.851
cm7nd5aub001i5n7jhdumk7o1	Equal participation	Encouraged equal participation and recognized every member's input.	3	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.851	2025-02-27 13:11:30.851
cm7nd5aub001k5n7j3u5ekeen	Adaptability	Stayed flexible when adapting to shifting team priorities.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.852	2025-02-27 13:11:30.852
cm7nd5auc001m5n7jtf7gdjp0	Team support	Supported teammates by offering help when workloads were high.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.852	2025-02-27 13:11:30.852
cm7nd5auc001o5n7jcg7x9dod	Trust building	Focused on trust-building to create a productive team environment.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.852	2025-02-27 13:11:30.852
cm7nd5auc001q5n7jf7zinxjj	Collective problem-solving	Addressed challenges collectively rather than assigning blame.	4	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.853	2025-02-27 13:11:30.853
cm7nd5aud001s5n7jy0s560fq	Recognition	Celebrated team achievements and highlighted individual contributions.	3	cm7nd5au900185n7j5qozgig9	2025-02-27 13:11:30.853	2025-02-27 13:11:30.853
cm7nd5aud001v5n7j7953oduj	Vision communication	Defined a clear vision and communicated it consistently.	5	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.854	2025-02-27 13:11:30.854
cm7nd5aue001x5n7jllw3tbwx	Ethical decision-making	Demonstrated accountability and ethical decision-making.	5	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.854	2025-02-27 13:11:30.854
cm7nd5aue001z5n7jjhjqw3ev	Team empowerment	Empowered teams through delegation and encouraging ownership.	4	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.855	2025-02-27 13:11:30.855
cm7nd5auf00215n7jw8vowyig	Mentorship	Facilitated career growth via mentorship and development.	4	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.855	2025-02-27 13:11:30.855
cm7nd5auf00235n7jhx5nj19u	Proactive leadership	Addressed challenges proactively and fostered resilience.	4	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.855	2025-02-27 13:11:30.855
cm7nd5auf00255n7jri0lpigz	Trust building	Built trust through open, honest communication and empathy.	4	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.856	2025-02-27 13:11:30.856
cm7nd5aug00275n7jpb2lbdb4	Values champion	Championed organizational values and inclusivity initiatives.	4	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.856	2025-02-27 13:11:30.856
cm7nd5aug00295n7jgv70pfbq	Achievement recognition	Recognized and celebrated individual and team achievements.	3	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.857	2025-02-27 13:11:30.857
cm7nd5aug002b5n7jdnckeo81	Cross-functional alignment	Aligned cross-functional objectives to drive success.	5	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.857	2025-02-27 13:11:30.857
cm7nd5auh002d5n7ju72zf6xg	Leading by example	Led by example, modeling integrity and professionalism.	5	cm7nd5aud001t5n7jr5iix9ym	2025-02-27 13:11:30.857	2025-02-27 13:11:30.857
cm7nd5auh002g5n7jszly88c9	Goal definition	Clearly defined team goals, responsibilities, and performance standards.	5	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.858	2025-02-27 13:11:30.858
cm7nd5aui002i5n7jwatpd55i	One-on-one meetings	Held regular one-on-one meetings for individual progress updates.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.858	2025-02-27 13:11:30.858
cm7nd5aui002k5n7jgf8zrs9e	Culture fostering	Fostered a culture of trust, transparency, and accountability.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.859	2025-02-27 13:11:30.859
cm7nd5aui002m5n7jccjkbkzd	Professional development	Encouraged professional development and growth opportunities.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.859	2025-02-27 13:11:30.859
cm7nd5auk002o5n7jihc7i80r	Workload management	Used data-driven methods to allocate tasks and manage workloads.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.86	2025-02-27 13:11:30.86
cm7nd5auk002q5n7jevpjv9ws	Conflict resolution	Resolved conflicts constructively to maintain team cohesion.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.861	2025-02-27 13:11:30.861
cm7nd5auk002s5n7jxyq2kzro	Achievement recognition	Celebrated team milestones and recognized achievements.	3	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.861	2025-02-27 13:11:30.861
cm7nd5aul002u5n7jeng6ldrz	Communication coaching	Coached team members on effective communication skills.	3	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.861	2025-02-27 13:11:30.861
cm7nd5aul002w5n7jkeihvius	Performance improvement	Implemented performance improvement plans when necessary.	4	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.862	2025-02-27 13:11:30.862
cm7nd5aul002y5n7jco2gyjzt	Organizational alignment	Ensured alignment of team objectives with broader organizational goals.	5	cm7nd5auh002e5n7j8vsjabh1	2025-02-27 13:11:30.862	2025-02-27 13:11:30.862
cm7nd5aum00315n7ju9zj6rp9	Code quality	Developed reliable, high-quality code following best practices and coding standards.	4	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.862	2025-02-27 13:11:30.862
cm7nd5aum00335n7jd9pb94dl	Code reviews	Performed thorough code reviews to enhance code quality and ensure standards compliance.	4	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.863	2025-02-27 13:11:30.863
cm7nd5aun00355n7j09nlqat3	Technical troubleshooting	Troubleshot and resolved complex technical issues with minimal downtime.	5	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.863	2025-02-27 13:11:30.863
cm7nd5aun00375n7ji65gf992	System optimization	Optimized system performance through refactoring and resource management.	5	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.863	2025-02-27 13:11:30.863
cm7nd5aun00395n7jtrp4vbfx	Architecture contribution	Contributed to architecture decisions and design considerations.	5	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.864	2025-02-27 13:11:30.864
cm7nd5auo003b5n7j22ktku39	Automated testing	Implemented automated testing to ensure robust and maintainable features.	4	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.864	2025-02-27 13:11:30.864
cm7nd5auo003d5n7jlnv66178	Requirements clarification	Clarified requirements based on product specifications to meet user needs.	3	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.864	2025-02-27 13:11:30.864
cm7nd5auo003f5n7jp3mx3ipq	Documentation	Ensured technical documentation was up to date for maintainability.	3	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.865	2025-02-27 13:11:30.865
cm7nd5aup003h5n7jin7qwme3	CI/CD maintenance	Maintained and improved CI/CD pipelines for streamlined deployments.	4	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.865	2025-02-27 13:11:30.865
cm7nd5aup003j5n7j68veneve	Security maintenance	Ensured security and data integrity through regular assessments and patches.	5	cm7nd5aum002z5n7j81aw79dt	2025-02-27 13:11:30.865	2025-02-27 13:11:30.865
cm7nd5auq003m5n7jqssu72z6	Market research	Conducted market research to validate product ideas and prioritize features.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.866	2025-02-27 13:11:30.866
cm7nd5auq003o5n7jh5d582nh	Requirements definition	Defined clear product requirements based on input from design and engineering.	5	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.866	2025-02-27 13:11:30.866
cm7nd5auq003q5n7jbtfhnoba	Roadmap development	Developed and maintained a product roadmap to meet company objectives.	5	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.867	2025-02-27 13:11:30.867
cm7nd5auq003s5n7jg11kvkc4	Customer feedback	Gathered customer feedback through interviews, surveys, and usage analytics.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.867	2025-02-27 13:11:30.867
cm7nd5aur003u5n7j3q5niyv7	User insights translation	Translated user insights into actionable features and enhancements.	5	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.867	2025-02-27 13:11:30.867
cm7nd5aur003w5n7je18b96i7	Product communication	Communicated product vision and updates to stakeholders regularly.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.868	2025-02-27 13:11:30.868
cm7nd5aur003y5n7jvipopoof	Data-driven iteration	Used data-driven metrics to measure product success and iterate quickly.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.868	2025-02-27 13:11:30.868
cm7nd5aus00405n7jl3rn8exl	Priority management	Balanced competing priorities by managing scope and trade-offs.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.868	2025-02-27 13:11:30.868
cm7nd5aus00425n7jyjog6j5m	Product positioning	Positioned the product to satisfy both business strategy and user needs.	5	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.869	2025-02-27 13:11:30.869
cm7nd5aus00445n7jpaax1hf0	Feature launch	Launched new features, monitored adoption, and iterated based on feedback.	4	cm7nd5aup003k5n7jyspvr0ku	2025-02-27 13:11:30.869	2025-02-27 13:11:30.869
cm7nd5aut00475n7j7bc80bta	User-centered design	Created intuitive, user-centered interfaces in accordance with brand guidelines.	5	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.869	2025-02-27 13:11:30.869
cm7nd5aut00495n7jk418buyc	User research	Conducted user research to inform design decisions and validate solutions.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.87	2025-02-27 13:11:30.87
cm7nd5auu004b5n7j69uao79a	Prototype development	Developed wireframes, prototypes, and high-fidelity mockups.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.87	2025-02-27 13:11:30.87
cm7nd5auu004d5n7jy1lpbhfe	Visual consistency	Ensured visual consistency and usability across digital products.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.87	2025-02-27 13:11:30.87
cm7nd5auv004f5n7jmpm8sxy5	Stakeholder liaison	Liaised with stakeholders to refine design requirements and constraints.	3	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.871	2025-02-27 13:11:30.871
cm7nd5auw004h5n7jgv9lri8c	Accessibility compliance	Applied accessibility standards (e.g., WCAG) for inclusive experiences.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.872	2025-02-27 13:11:30.872
cm7nd5auw004j5n7jw3rncu94	Design iteration	Iterated on designs based on user testing and feedback.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.873	2025-02-27 13:11:30.873
cm7nd5aux004l5n7je5l62b54	Design system	Maintained a cohesive design system to streamline development handoffs.	5	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.873	2025-02-27 13:11:30.873
cm7nd5aux004n5n7jbsdrbvof	Design presentation	Presented design concepts to relevant stakeholders for feedback.	3	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.874	2025-02-27 13:11:30.874
cm7nd5auy004p5n7jdl3ecmip	Design improvements	Monitored product metrics to identify design improvement opportunities.	4	cm7nd5aut00455n7jrp16j4im	2025-02-27 13:11:30.874	2025-02-27 13:11:30.874
cm7nd5auz004s5n7j4lj3kzj1	Campaign execution	Planned and executed multi-channel campaigns to drive brand awareness.	5	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.876	2025-02-27 13:11:30.876
cm7nd5av0004u5n7j0vbfgvxp	Market segmentation	Conducted market segmentation to refine messaging and targeting.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.876	2025-02-27 13:11:30.876
cm7nd5av0004w5n7jffkhd3pa	Performance analysis	Analyzed campaign performance metrics and optimized for ROI.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.877	2025-02-27 13:11:30.877
cm7nd5av1004y5n7jkiuh431v	Creative management	Managed creative resources to produce high-quality marketing assets.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.877	2025-02-27 13:11:30.877
cm7nd5av100505n7j7sgh6zlg	Content calendar	Maintained an editorial calendar for consistent content output.	3	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.878	2025-02-27 13:11:30.878
cm7nd5av200525n7jikxfy84g	Lead nurturing	Nurtured leads through email automation and targeted messaging.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.878	2025-02-27 13:11:30.878
cm7nd5av200545n7jz3fufoo7	A/B testing	Conducted A/B testing to refine ad creatives and landing pages.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.879	2025-02-27 13:11:30.879
cm7nd5av200565n7jvu04t7co	Strategic partnerships	Built strategic partnerships and co-marketing opportunities.	5	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.879	2025-02-27 13:11:30.879
cm7nd5av300585n7j06wfdbuj	Sales coordination	Coordinated with sales for effective lead management and follow-up.	4	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.879	2025-02-27 13:11:30.879
cm7nd5av3005a5n7jnauuag0j	Social monitoring	Monitored social sentiment and implemented feedback-driven changes.	3	cm7nd5auz004q5n7jleqamrj4	2025-02-27 13:11:30.88	2025-02-27 13:11:30.88
cm7nd5av4005d5n7j08kfwfqa	Data preparation	Gathered, cleaned, and transformed data sets for insightful analyses.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.88	2025-02-27 13:11:30.88
cm7nd5av4005f5n7j7oss9zyb	Dashboard creation	Built dashboards and reports to track key performance metrics.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.881	2025-02-27 13:11:30.881
cm7nd5av5005h5n7jfm6kdvzj	Statistical analysis	Utilized statistical methods to identify trends and forecast outcomes.	5	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.881	2025-02-27 13:11:30.881
cm7nd5av5005j5n7jzvm4ea2k	A/B test analysis	Conducted A/B tests and interpreted results for product decisions.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.881	2025-02-27 13:11:30.881
cm7nd5av5005l5n7j87ghpmn9	KPI tracking	Defined and tracked actionable KPIs for business objectives.	5	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.882	2025-02-27 13:11:30.882
cm7nd5av6005n5n7jj2yf4sgn	Data validation	Ensured data integrity through rigorous validation processes.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.882	2025-02-27 13:11:30.882
cm7nd5av6005p5n7jenvdaq62	Predictive modeling	Leveraged predictive modeling and ML for strategic insights.	5	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.882	2025-02-27 13:11:30.882
cm7nd5av6005r5n7jievvkzfe	Self-service analytics	Created self-service analytics solutions for stakeholders.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.883	2025-02-27 13:11:30.883
cm7nd5av7005t5n7jsfgjh5to	Anomaly investigation	Investigated data anomalies and implemented corrective actions.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.883	2025-02-27 13:11:30.883
cm7nd5av7005v5n7jc8i4a1h1	Compliance maintenance	Maintained compliance with data privacy regulations.	4	cm7nd5av4005b5n7jkd2snoxh	2025-02-27 13:11:30.883	2025-02-27 13:11:30.883
cm7nd5av8005y5n7jugd4kapb	Customer onboarding	Delivered comprehensive onboarding experiences for new customers.	5	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.884	2025-02-27 13:11:30.884
cm7nd5av800605n7jqkllyc2o	Relationship maintenance	Maintained relationships through regular check-ins and health reviews.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.884	2025-02-27 13:11:30.884
cm7nd5av800625n7jstsj0046	Support resolution	Provided quick solutions to inquiries via multiple support channels.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.885	2025-02-27 13:11:30.885
cm7nd5av900645n7jqtv8euil	Feedback capture	Captured customer feedback and relayed it to product teams.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.885	2025-02-27 13:11:30.885
cm7nd5av900665n7jzd5770ao	Upsell identification	Identified upsell opportunities by understanding customer goals.	5	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.885	2025-02-27 13:11:30.885
cm7nd5av900685n7jf1vnb62l	Self-service resources	Created and updated self-service resources (FAQs, tutorials).	3	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.886	2025-02-27 13:11:30.886
cm7nd5ava006a5n7jsc4748wb	Usage monitoring	Monitored usage metrics to preempt churn risks.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.886	2025-02-27 13:11:30.886
cm7nd5ava006c5n7jqji4qd12	Issue escalation	Escalated complex challenges to relevant departments for swift resolution.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.887	2025-02-27 13:11:30.887
cm7nd5avb006e5n7j069obnps	Best practices guidance	Guided customers on best practices for maximum product value.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.887	2025-02-27 13:11:30.887
cm7nd5avb006g5n7jug123acm	Satisfaction measurement	Measured satisfaction (NPS, CSAT) and drove retention improvements.	4	cm7nd5av7005w5n7jh0sxg4c4	2025-02-27 13:11:30.888	2025-02-27 13:11:30.888
cm7nd5avc006j5n7jt722zbrx	Financial operations	Managed billing, invoicing, and collections for timely cash flow.	4	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.888	2025-02-27 13:11:30.888
cm7nd5avc006l5n7jlq6um8d6	Financial reporting	Prepared monthly and annual financial statements and reports.	4	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.889	2025-02-27 13:11:30.889
cm7nd5avc006n5n7jphd0b567	Spending analysis	Analyzed spending trends to support cost optimization and budgeting.	4	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.889	2025-02-27 13:11:30.889
cm7nd5avd006p5n7jnzmfxu88	Regulatory compliance	Ensured compliance with accounting standards and regulations.	5	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.889	2025-02-27 13:11:30.889
cm7nd5avd006r5n7jlz13uhwd	Payroll management	Oversaw payroll and benefits administration in coordination with HR.	4	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.889	2025-02-27 13:11:30.889
cm7nd5avd006t5n7j93moi38v	Financial forecasting	Maintained accurate forecasting models for revenue and expenses.	5	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.89	2025-02-27 13:11:30.89
cm7nd5ave006v5n7jvj5auzq2	Audit management	Conducted audits to identify and mitigate financial risks.	5	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.89	2025-02-27 13:11:30.89
cm7nd5ave006x5n7ji0am8h4t	External relations	Liaised with external stakeholders like banks and auditors.	4	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.89	2025-02-27 13:11:30.89
cm7nd5ave006z5n7jnkwpcfr5	Financial controls	Established financial controls to prevent fraud or misuse.	5	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.891	2025-02-27 13:11:30.891
cm7nd5avf00715n7jgvzn46rm	Strategic alignment	Aligned financial strategies with overall business objectives.	5	cm7nd5avb006h5n7jtu77jlx6	2025-02-27 13:11:30.891	2025-02-27 13:11:30.891
cm7nd5avf00745n7jcatpe7z9	Contract management	Drafted and reviewed contracts, NDAs, and service-level agreements.	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.892	2025-02-27 13:11:30.892
cm7nd5avg00765n7jhvhsc3q9	Regulatory guidance	Provided counsel on regulatory compliance and risk management.	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.892	2025-02-27 13:11:30.892
cm7nd5avg00785n7jay3wj5m9	IP management	Managed intellectual property filings and trademark registrations.	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.893	2025-02-27 13:11:30.893
cm7nd5avg007a5n7jbpx7jshm	Legal research	Conducted legal research to guide strategic decisions.	4	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.893	2025-02-27 13:11:30.893
cm7nd5avh007c5n7jhx1bzycc	Privacy compliance	Advised on privacy and data protection laws (GDPR, CCPA).	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.893	2025-02-27 13:11:30.893
cm7nd5avh007e5n7jyhm1fkx1	Corporate governance	Enforced corporate governance policies and ensured alignment.	4	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.894	2025-02-27 13:11:30.894
cm7nd5avh007g5n7jwres2vps	Risk mitigation	Oversaw risk mitigation efforts across relevant departments.	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.894	2025-02-27 13:11:30.894
cm7nd5avi007i5n7jfg14sx8o	Dispute handling	Handled disputes, negotiations, and settlements with external parties.	5	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.894	2025-02-27 13:11:30.894
cm7nd5avi007k5n7jnobsxlj9	Documentation	Maintained comprehensive documentation of legal processes.	4	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.895	2025-02-27 13:11:30.895
cm7nd5avi007m5n7jy7yop6ra	Legal monitoring	Monitored legal developments to inform company strategy.	4	cm7nd5avf00725n7jvdd3dhxj	2025-02-27 13:11:30.895	2025-02-27 13:11:30.895
cm7nd5avj007p5n7jare8ymc9	Recruitment strategy	Developed and executed recruitment strategies to attract top talent.	5	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.895	2025-02-27 13:11:30.895
cm7nd5avj007r5n7j73gj5qyw	Candidate management	Screened candidates, conducted interviews, and managed hiring pipelines.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.896	2025-02-27 13:11:30.896
cm7nd5avk007t5n7jprvt5r4n	Onboarding programs	Organized onboarding and orientation programs for new hires.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.896	2025-02-27 13:11:30.896
cm7nd5avk007v5n7j72gywk6u	Benefits administration	Administered payroll, benefits, and compensation plans.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.897	2025-02-27 13:11:30.897
cm7nd5avk007x5n7j6o6bxyq7	Culture cultivation	Mediated employee relations and cultivated a positive culture.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.897	2025-02-27 13:11:30.897
cm7nd5avl007z5n7jw93slin7	Training coordination	Coordinated training and development initiatives.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.897	2025-02-27 13:11:30.897
cm7nd5avl00815n7jiyr1hlb3	Compliance enforcement	Ensured compliance with labor laws and policies.	5	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.898	2025-02-27 13:11:30.898
cm7nd5avl00835n7jx07wgvq1	Performance management	Conducted performance reviews and feedback sessions.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.898	2025-02-27 13:11:30.898
cm7nd5avm00855n7jyogzipfh	DEI promotion	Promoted diversity, equity, and inclusion in the workplace.	4	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.898	2025-02-27 13:11:30.898
cm7nd5avm00875n7jl7hdcvwk	Offboarding management	Managed offboarding processes and exit interviews.	3	cm7nd5avj007n5n7j1mewouii	2025-02-27 13:11:30.898	2025-02-27 13:11:30.898
cm7nd5avn008a5n7junmkh60j	Infrastructure maintenance	Installed and maintained hardware, software, and network systems.	4	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.899	2025-02-27 13:11:30.899
cm7nd5avn008c5n7jc30gxuj2	System monitoring	Monitored system performance, swiftly addressing outages.	5	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.899	2025-02-27 13:11:30.899
cm7nd5avn008e5n7j190r36pf	Security implementation	Implemented cybersecurity measures (firewalls, encryption).	5	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.9	2025-02-27 13:11:30.9
cm7nd5avn008g5n7jqjyz6b3a	Security auditing	Conducted regular security audits and penetration tests.	5	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.9	2025-02-27 13:11:30.9
cm7nd5avo008i5n7j2zktfj7l	Disaster recovery	Led disaster recovery planning and data backup strategies.	5	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.9	2025-02-27 13:11:30.9
cm7nd5avo008k5n7jbr8qd1iv	Access control	Maintained user access controls and identity management.	4	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.9	2025-02-27 13:11:30.9
cm7nd5avo008m5n7jl46a5oki	Incident response	Investigated and remediated security breaches or incidents.	5	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.901	2025-02-27 13:11:30.901
cm7nd5avp008o5n7jgagnen4d	Policy development	Developed IT policies for data protection and compliance.	4	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.901	2025-02-27 13:11:30.901
cm7nd5avp008q5n7jaskw1nzz	Security training	Provided user training on security awareness and best practices.	4	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.901	2025-02-27 13:11:30.901
cm7nd5avp008s5n7jbbpdyqb6	Threat adaptation	Stayed updated on emerging threats and adapted defense strategies.	4	cm7nd5avm00885n7jolp9ciel	2025-02-27 13:11:30.902	2025-02-27 13:11:30.902
cm7nd5avq008v5n7jk6ijyy7v	Research scoping	Identified key questions to guide research project scopes.	4	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.903	2025-02-27 13:11:30.903
cm7nd5avq008x5n7j83xy7b8y	Study execution	Designed and executed studies using qualitative and quantitative methods.	5	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.903	2025-02-27 13:11:30.903
cm7nd5avr008z5n7jl6nf190o	Data analysis	Analyzed data to uncover insights and inform strategic decisions.	5	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.903	2025-02-27 13:11:30.903
cm7nd5avr00915n7jqv3fm7qm	Product integration	Integrated findings into product development cycles.	5	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.903	2025-02-27 13:11:30.903
cm7nd5avr00935n7jzmih0t9k	Competitive analysis	Conducted literature reviews and competitive benchmarking.	4	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.904	2025-02-27 13:11:30.904
cm7nd5avr00955n7jmz6drwte	Research documentation	Maintained detailed research documentation and repositories.	3	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.904	2025-02-27 13:11:30.904
cm7nd5avs00975n7jotckg3q9	Participant management	Recruited participants and handled ethics requirements.	3	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.904	2025-02-27 13:11:30.904
cm7nd5avs00995n7jd3c6s8ry	Finding presentation	Presented findings and recommended next steps to stakeholders.	4	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.904	2025-02-27 13:11:30.904
cm7nd5avs009b5n7je4utxppn	Advanced analysis	Used advanced data analysis tools to identify patterns and trends.	5	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.905	2025-02-27 13:11:30.905
cm7nd5avt009d5n7jeyh5reb2	Research iteration	Iterated on research plans based on ongoing feedback and goals.	4	cm7nd5avq008t5n7jwybev4xy	2025-02-27 13:11:30.905	2025-02-27 13:11:30.905
cm7nd5avt009g5n7jzi1gdpn7	Process optimization	Streamlined processes to enhance efficiency and reduce costs.	5	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.906	2025-02-27 13:11:30.906
cm7nd5avt009i5n7jmg51aksg	Supply chain management	Managed supply chain logistics, vendor relationships, and procurement.	4	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.906	2025-02-27 13:11:30.906
cm7nd5avu009k5n7j8o00oers	Process documentation	Created process documentation and standard operating procedures.	3	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.906	2025-02-27 13:11:30.906
cm7nd5avu009m5n7jlg32wl4q	Operational metrics	Established metrics to monitor operational effectiveness.	4	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.906	2025-02-27 13:11:30.906
cm7nd5avu009o5n7j9rhl5aqf	Resource optimization	Optimized resource allocation based on data insights.	4	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.907	2025-02-27 13:11:30.907
cm7nd5avv009q5n7jcejrl9py	Compliance management	Ensured compliance with health, safety, and industry regulations.	5	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.907	2025-02-27 13:11:30.907
cm7nd5avv009s5n7jm0ayafs2	Process reviews	Held regular reviews to identify improvement areas.	3	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.907	2025-02-27 13:11:30.907
cm7nd5avv009u5n7j4b4dkxo0	Budget oversight	Oversaw budget management in partnership with finance.	4	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.908	2025-02-27 13:11:30.908
cm7nd5avv009w5n7joumgwtma	Technology adoption	Adopted new tools and technologies for continuous improvement.	4	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.908	2025-02-27 13:11:30.908
cm7nd5avw009y5n7j0l2wtf04	Workflow maintenance	Maintained consistency in day-to-day operational workflows.	3	cm7nd5avt009e5n7jokvvkmd7	2025-02-27 13:11:30.908	2025-02-27 13:11:30.908
cm7nd5avw00a15n7jpxqe5zai	Training development	Developed and delivered training programs for employees or clients.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.909	2025-02-27 13:11:30.909
cm7nd5avx00a35n7j4zjd7w13	Material creation	Created instructional materials aligned with clear learning objectives.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.909	2025-02-27 13:11:30.909
cm7nd5avx00a55n7joec92ld0	E-learning management	Leveraged e-learning platforms for accessible remote training.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.909	2025-02-27 13:11:30.909
cm7nd5avx00a75n7jw5dqkjwj	Workshop facilitation	Conducted workshops, seminars, and webinars to upskill learners.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.91	2025-02-27 13:11:30.91
cm7nd5avy00a95n7jkolm2fhs	Training evaluation	Evaluated training effectiveness through feedback and performance metrics.	3	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.91	2025-02-27 13:11:30.91
cm7nd5avy00ab5n7jvav3i5ym	Content collaboration	Worked with experts to ensure accurate, relevant course content.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.91	2025-02-27 13:11:30.91
cm7nd5avy00ad5n7j77w869bs	Interactive learning	Facilitated interactive learning sessions to enhance skill development.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.911	2025-02-27 13:11:30.911
cm7nd5avz00af5n7jz17zlpb5	Learning adaptation	Adapted educational approaches for diverse learning styles.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.911	2025-02-27 13:11:30.911
cm7nd5avz00ah5n7jb22v3xce	Knowledge management	Maintained updated resources in a centralized knowledge base.	3	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.912	2025-02-27 13:11:30.912
cm7nd5avz00aj5n7j0lx25477	Learning innovation	Explored new tools and methods to enhance learning outcomes.	4	cm7nd5avw009z5n7jujg1y8nn	2025-02-27 13:11:30.912	2025-02-27 13:11:30.912
\.


--
-- Data for Name: app_users; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.app_users (id, email, name, "clerkId", "createdAt", "updatedAt", "deletedAt", "customFields", "subscriptionEnd", "subscriptionStart", "subscriptionTier") FROM stdin;
cm7yqfykv0000lw9jx403e5hd	jjayaraaj@gmail.com	Jay Jayaraaj	user_2tzKEE8gLAqex1kaZeb6lkcGccD	2025-03-07 12:09:11.12	2025-03-07 12:09:11.12	\N	{"lastName": "Jayaraaj", "createdAt": "2025-03-07T12:09:11.119Z", "firstName": "Jay", "lastUpdated": "2025-03-07T12:09:11.119Z"}	\N	2025-03-07 12:09:11.119	FREE
cm865klqa0000v2g6upyrfsck	helixapp2024@gmail.com	Gianeo	user_2uDze5biL8KYTFXnjjNyJvU4i9d	2025-03-12 16:47:05.214	2025-03-12 16:47:05.214	\N	{"lastName": null, "createdAt": "2025-03-12T16:47:05.213Z", "firstName": "Gianeo", "lastUpdated": "2025-03-12T16:47:05.213Z"}	\N	2025-03-12 16:47:05.213	FREE
cm7nd6ugx0001y132g35cbnac	jjayaraaj2@gmail.com	Jay E	user_2tcqxxP286fhpxoi3ZIVLb0wIAk	2025-02-27 13:12:42.945	2025-04-15 15:43:10.449	\N	{"lastName": "E", "createdAt": "2025-02-27T13:12:42.944Z", "favorites": {"cm7nd5atu00025n7jczacmikq": [], "cm7nd5au5000n5n7jhc6x2khk": ["cm7nd5au6000r5n7jhq6q56af", "cm7nd5au5000p5n7jmxry77qd"], "cm7nd5au900185n7j5qozgig9": [], "cm7nd5aud001t5n7jr5iix9ym": [], "cm7nd5auh002e5n7j8vsjabh1": ["cm7nd5aui002i5n7jwatpd55i", "cm7nd5aui002k5n7jgf8zrs9e"], "cm7nd5aum002z5n7j81aw79dt": ["cm7nd5aum00315n7ju9zj6rp9"]}, "firstName": "Jay", "lastUpdated": "2025-02-27T13:12:42.944Z"}	\N	2025-02-27 13:12:42.944	FREE
cm9r8hgfm000121ud8bluyc2z	Saravanan@hellix.com	Sarav	\N	2025-04-21 15:31:29.267	2025-04-21 15:31:29.267	\N	{"invitedBy": "cm7nd6ugx0001y132g35cbnac"}	\N	\N	FREE
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.audit_logs (id, action, "entityType", "entityId", changes, "performedBy", "createdAt") FROM stdin;
\.


--
-- Data for Name: g_teams; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.g_teams (id, name, description, "teamFunctionId", "ownerId", "createdAt", "updatedAt", "deletedAt", "customFields") FROM stdin;
cm9r8hgfu000421udmwq7dgyj	Design Technologist	\N	cm9r8hgfs000221ud0sw580o9	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.274	2025-04-21 15:31:29.274	\N	{"functions": ["Leadership"], "categories": ["cm7nd5aud001t5n7jr5iix9ym"]}
team-1744613711232	Design Technologist New	\N	Leadership	cm7nd6ugx0001y132g35cbnac	2025-04-14 11:14:16.552	2025-04-14 11:14:16.552	\N	{"categories": ["cm7nd5aud001t5n7jr5iix9ym"]}
\.


--
-- Data for Name: job_grades; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.job_grades (id, level, grade, "createdAt", "updatedAt", "deletedAt", "customFields", "typicalResponsibilities") FROM stdin;
\.


--
-- Data for Name: job_titles; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.job_titles (id, name, "teamFunctionId", "createdAt", "updatedAt", "deletedAt", "customFields") FROM stdin;
\.


--
-- Data for Name: member_comments; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.member_comments (id, content, "teamMemberId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: member_scores; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.member_scores (id, value, "teamMemberId", "actionId", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: org_actions; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.org_actions (id, "actionId", priority, status, "dueDate", "teamId", "createdBy", "createdAt", "updatedAt", "deletedAt", "customFields") FROM stdin;
cm9gz7pvc003kg4fmtozvaq4i	cm7nd5aud001v5n7j7953oduj	MEDIUM	ACTIVE	\N	team-1744613711232	cm7nd6ugx0001y132g35cbnac	2025-04-14 11:14:16.632	2025-04-14 11:14:16.632	\N	\N
cm9r8hgg8000621udzs6zj0ap	cm7nd5aud001v5n7j7953oduj	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.288	2025-04-21 15:31:29.288	\N	\N
cm9r8hggb000821uda3q6c19r	cm7nd5aue001x5n7jllw3tbwx	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.292	2025-04-21 15:31:29.292	\N	\N
cm9r8hggd000a21udxdx9q9d2	cm7nd5aue001z5n7jjhjqw3ev	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.293	2025-04-21 15:31:29.293	\N	\N
cm9r8hgge000c21ud88rdwuvl	cm7nd5auf00215n7jw8vowyig	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.294	2025-04-21 15:31:29.294	\N	\N
cm9r8hggf000e21udngk1prv9	cm7nd5auf00235n7jhx5nj19u	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.295	2025-04-21 15:31:29.295	\N	\N
cm9r8hggf000g21udyk4qupaj	cm7nd5auf00255n7jri0lpigz	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.296	2025-04-21 15:31:29.296	\N	\N
cm9r8hggg000i21ude963lwbp	cm7nd5aug00275n7jpb2lbdb4	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.297	2025-04-21 15:31:29.297	\N	\N
cm9r8hggh000k21udk3hpdryw	cm7nd5aug00295n7jgv70pfbq	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.298	2025-04-21 15:31:29.298	\N	\N
cm9r8hggi000m21udgj3sev0c	cm7nd5aug002b5n7jdnckeo81	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.298	2025-04-21 15:31:29.298	\N	\N
cm9r8hggj000o21ud7ka4ec33	cm7nd5auh002d5n7ju72zf6xg	MEDIUM	ACTIVE	\N	cm9r8hgfu000421udmwq7dgyj	cm7nd6ugx0001y132g35cbnac	2025-04-21 15:31:29.299	2025-04-21 15:31:29.299	\N	\N
\.


--
-- Data for Name: org_name; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.org_name (id, name, "userId", "createdAt") FROM stdin;
cm9gz7psw003ig4fm3v49plde	chargebee	cm7nd6ugx0001y132g35cbnac	2025-04-14 11:14:16.545
\.


--
-- Data for Name: performance_reviews; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.performance_reviews (id, quarter, year, content, status, version, "teamMemberId", "createdAt", "updatedAt", "customFields") FROM stdin;
\.


--
-- Data for Name: structured_feedback; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.structured_feedback (id, strengths, improvements, goals, "teamMemberId", "createdAt", "updatedAt", "customFields") FROM stdin;
\.


--
-- Data for Name: team_functions; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.team_functions (id, name, description, "createdAt", "updatedAt", "deletedAt", "customFields") FROM stdin;
Leadership	Function Leadersh	Automatically created during onboarding	2025-04-14 11:14:16.536	2025-04-14 11:14:16.536	\N	\N
cm9r8hgfs000221ud0sw580o9	Leadership	Function for Design Technologist	2025-04-21 15:31:29.272	2025-04-21 15:31:29.272	\N	\N
\.


--
-- Data for Name: team_members; Type: TABLE DATA; Schema: public; Owner: jayaraj
--

COPY public.team_members (id, "userId", "teamId", title, "isAdmin", status, "firstName", "lastName", "photoUrl", "joinedDate", "jobGradeId", "createdAt", "updatedAt", "deletedAt", "customFields") FROM stdin;
cm9r8hggj000q21ud13ozh0t2	cm9r8hgfm000121ud8bluyc2z	cm9r8hgfu000421udmwq7dgyj	\N	f	ACTIVE	\N	\N	\N	\N	\N	2025-04-21 15:31:29.3	2025-04-21 15:31:29.3	\N	\N
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: action_categories action_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.action_categories
    ADD CONSTRAINT action_categories_pkey PRIMARY KEY (id);


--
-- Name: actions actions_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT actions_pkey PRIMARY KEY (id);


--
-- Name: app_users app_users_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.app_users
    ADD CONSTRAINT app_users_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: g_teams g_teams_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.g_teams
    ADD CONSTRAINT g_teams_pkey PRIMARY KEY (id);


--
-- Name: job_grades job_grades_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.job_grades
    ADD CONSTRAINT job_grades_pkey PRIMARY KEY (id);


--
-- Name: job_titles job_titles_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.job_titles
    ADD CONSTRAINT job_titles_pkey PRIMARY KEY (id);


--
-- Name: member_comments member_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.member_comments
    ADD CONSTRAINT member_comments_pkey PRIMARY KEY (id);


--
-- Name: member_scores member_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.member_scores
    ADD CONSTRAINT member_scores_pkey PRIMARY KEY (id);


--
-- Name: org_actions org_actions_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_actions
    ADD CONSTRAINT org_actions_pkey PRIMARY KEY (id);


--
-- Name: org_name org_name_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_name
    ADD CONSTRAINT org_name_pkey PRIMARY KEY (id);


--
-- Name: performance_reviews performance_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT performance_reviews_pkey PRIMARY KEY (id);


--
-- Name: structured_feedback structured_feedback_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.structured_feedback
    ADD CONSTRAINT structured_feedback_pkey PRIMARY KEY (id);


--
-- Name: team_functions team_functions_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.team_functions
    ADD CONSTRAINT team_functions_pkey PRIMARY KEY (id);


--
-- Name: team_members team_members_pkey; Type: CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT team_members_pkey PRIMARY KEY (id);


--
-- Name: action_categories_name_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX action_categories_name_key ON public.action_categories USING btree (name);


--
-- Name: actions_categoryId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "actions_categoryId_idx" ON public.actions USING btree ("categoryId");


--
-- Name: actions_name_categoryId_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "actions_name_categoryId_key" ON public.actions USING btree (name, "categoryId");


--
-- Name: app_users_clerkId_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "app_users_clerkId_key" ON public.app_users USING btree ("clerkId");


--
-- Name: app_users_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "app_users_deletedAt_idx" ON public.app_users USING btree ("deletedAt");


--
-- Name: app_users_email_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX app_users_email_key ON public.app_users USING btree (email);


--
-- Name: app_users_subscriptionTier_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "app_users_subscriptionTier_idx" ON public.app_users USING btree ("subscriptionTier");


--
-- Name: audit_logs_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "audit_logs_createdAt_idx" ON public.audit_logs USING btree ("createdAt");


--
-- Name: audit_logs_entityType_entityId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "audit_logs_entityType_entityId_idx" ON public.audit_logs USING btree ("entityType", "entityId");


--
-- Name: audit_logs_performedBy_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "audit_logs_performedBy_idx" ON public.audit_logs USING btree ("performedBy");


--
-- Name: g_teams_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "g_teams_deletedAt_idx" ON public.g_teams USING btree ("deletedAt");


--
-- Name: g_teams_name_ownerId_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "g_teams_name_ownerId_key" ON public.g_teams USING btree (name, "ownerId");


--
-- Name: g_teams_ownerId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "g_teams_ownerId_idx" ON public.g_teams USING btree ("ownerId");


--
-- Name: g_teams_teamFunctionId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "g_teams_teamFunctionId_idx" ON public.g_teams USING btree ("teamFunctionId");


--
-- Name: job_grades_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "job_grades_deletedAt_idx" ON public.job_grades USING btree ("deletedAt");


--
-- Name: job_grades_grade_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX job_grades_grade_key ON public.job_grades USING btree (grade);


--
-- Name: job_grades_level_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX job_grades_level_key ON public.job_grades USING btree (level);


--
-- Name: job_titles_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "job_titles_deletedAt_idx" ON public.job_titles USING btree ("deletedAt");


--
-- Name: job_titles_name_teamFunctionId_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "job_titles_name_teamFunctionId_key" ON public.job_titles USING btree (name, "teamFunctionId");


--
-- Name: job_titles_teamFunctionId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "job_titles_teamFunctionId_idx" ON public.job_titles USING btree ("teamFunctionId");


--
-- Name: member_comments_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "member_comments_createdAt_idx" ON public.member_comments USING btree ("createdAt");


--
-- Name: member_comments_teamMemberId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "member_comments_teamMemberId_idx" ON public.member_comments USING btree ("teamMemberId");


--
-- Name: member_scores_actionId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "member_scores_actionId_idx" ON public.member_scores USING btree ("actionId");


--
-- Name: member_scores_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "member_scores_createdAt_idx" ON public.member_scores USING btree ("createdAt");


--
-- Name: member_scores_teamMemberId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "member_scores_teamMemberId_idx" ON public.member_scores USING btree ("teamMemberId");


--
-- Name: org_actions_actionId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "org_actions_actionId_idx" ON public.org_actions USING btree ("actionId");


--
-- Name: org_actions_createdBy_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "org_actions_createdBy_idx" ON public.org_actions USING btree ("createdBy");


--
-- Name: org_actions_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "org_actions_deletedAt_idx" ON public.org_actions USING btree ("deletedAt");


--
-- Name: org_actions_status_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX org_actions_status_idx ON public.org_actions USING btree (status);


--
-- Name: org_actions_teamId_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "org_actions_teamId_createdAt_idx" ON public.org_actions USING btree ("teamId", "createdAt");


--
-- Name: performance_reviews_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "performance_reviews_createdAt_idx" ON public.performance_reviews USING btree ("createdAt");


--
-- Name: performance_reviews_status_teamMemberId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "performance_reviews_status_teamMemberId_idx" ON public.performance_reviews USING btree (status, "teamMemberId");


--
-- Name: performance_reviews_teamMemberId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "performance_reviews_teamMemberId_idx" ON public.performance_reviews USING btree ("teamMemberId");


--
-- Name: performance_reviews_teamMemberId_quarter_year_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "performance_reviews_teamMemberId_quarter_year_key" ON public.performance_reviews USING btree ("teamMemberId", quarter, year);


--
-- Name: performance_reviews_year_quarter_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX performance_reviews_year_quarter_idx ON public.performance_reviews USING btree (year, quarter);


--
-- Name: structured_feedback_createdAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "structured_feedback_createdAt_idx" ON public.structured_feedback USING btree ("createdAt");


--
-- Name: structured_feedback_teamMemberId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "structured_feedback_teamMemberId_idx" ON public.structured_feedback USING btree ("teamMemberId");


--
-- Name: team_functions_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "team_functions_deletedAt_idx" ON public.team_functions USING btree ("deletedAt");


--
-- Name: team_functions_name_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX team_functions_name_key ON public.team_functions USING btree (name);


--
-- Name: team_members_deletedAt_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "team_members_deletedAt_idx" ON public.team_members USING btree ("deletedAt");


--
-- Name: team_members_jobGradeId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "team_members_jobGradeId_idx" ON public.team_members USING btree ("jobGradeId");


--
-- Name: team_members_status_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX team_members_status_idx ON public.team_members USING btree (status);


--
-- Name: team_members_teamId_idx; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE INDEX "team_members_teamId_idx" ON public.team_members USING btree ("teamId");


--
-- Name: team_members_userId_teamId_key; Type: INDEX; Schema: public; Owner: jayaraj
--

CREATE UNIQUE INDEX "team_members_userId_teamId_key" ON public.team_members USING btree ("userId", "teamId");


--
-- Name: actions actions_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.actions
    ADD CONSTRAINT "actions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.action_categories(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: g_teams g_teams_ownerId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.g_teams
    ADD CONSTRAINT "g_teams_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES public.app_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: g_teams g_teams_teamFunctionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.g_teams
    ADD CONSTRAINT "g_teams_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES public.team_functions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: job_titles job_titles_teamFunctionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.job_titles
    ADD CONSTRAINT "job_titles_teamFunctionId_fkey" FOREIGN KEY ("teamFunctionId") REFERENCES public.team_functions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: member_comments member_comments_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.member_comments
    ADD CONSTRAINT "member_comments_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_scores member_scores_actionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.member_scores
    ADD CONSTRAINT "member_scores_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES public.org_actions(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: member_scores member_scores_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.member_scores
    ADD CONSTRAINT "member_scores_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: org_actions org_actions_actionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_actions
    ADD CONSTRAINT "org_actions_actionId_fkey" FOREIGN KEY ("actionId") REFERENCES public.actions(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: org_actions org_actions_createdBy_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_actions
    ADD CONSTRAINT "org_actions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES public.app_users(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: org_actions org_actions_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_actions
    ADD CONSTRAINT "org_actions_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public.g_teams(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: org_name org_name_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.org_name
    ADD CONSTRAINT "org_name_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.app_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: performance_reviews performance_reviews_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.performance_reviews
    ADD CONSTRAINT "performance_reviews_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: structured_feedback structured_feedback_teamMemberId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.structured_feedback
    ADD CONSTRAINT "structured_feedback_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES public.team_members(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_members team_members_jobGradeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "team_members_jobGradeId_fkey" FOREIGN KEY ("jobGradeId") REFERENCES public.job_grades(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: team_members team_members_teamId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "team_members_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES public.g_teams(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: team_members team_members_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: jayaraj
--

ALTER TABLE ONLY public.team_members
    ADD CONSTRAINT "team_members_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.app_users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: jayaraj
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

