--
-- PostgreSQL database dump
--

\restrict MBSXw668c6J5wCJJ297ZB3sirrBoehzP6uL9LKhsgMaBz9dLubhfydTxMRlei6O

-- Dumped from database version 17.10
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public."TaskResource" DROP CONSTRAINT IF EXISTS "TaskResource_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public."RoadmapModule" DROP CONSTRAINT IF EXISTS "RoadmapModule_roadmapId_fkey";
ALTER TABLE IF EXISTS ONLY public."Revision" DROP CONSTRAINT IF EXISTS "Revision_taskId_fkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_folderId_fkey";
ALTER TABLE IF EXISTS ONLY public."HabitLog" DROP CONSTRAINT IF EXISTS "HabitLog_habitId_fkey";
ALTER TABLE IF EXISTS ONLY public."Folder" DROP CONSTRAINT IF EXISTS "Folder_parentId_fkey";
DROP INDEX IF EXISTS public."TaskResource_taskId_idx";
DROP INDEX IF EXISTS public."Roadmap_userId_idx";
DROP INDEX IF EXISTS public."RoadmapModule_roadmapId_idx";
DROP INDEX IF EXISTS public."Revision_userId_status_idx";
DROP INDEX IF EXISTS public."Revision_userId_scheduledAt_idx";
DROP INDEX IF EXISTS public."Revision_taskId_idx";
DROP INDEX IF EXISTS public."HabitLog_habitId_idx";
DROP INDEX IF EXISTS public."HabitLog_habitId_date_key";
ALTER TABLE IF EXISTS ONLY public._prisma_migrations DROP CONSTRAINT IF EXISTS _prisma_migrations_pkey;
ALTER TABLE IF EXISTS ONLY public."Task" DROP CONSTRAINT IF EXISTS "Task_pkey";
ALTER TABLE IF EXISTS ONLY public."TaskResource" DROP CONSTRAINT IF EXISTS "TaskResource_pkey";
ALTER TABLE IF EXISTS ONLY public."Roadmap" DROP CONSTRAINT IF EXISTS "Roadmap_pkey";
ALTER TABLE IF EXISTS ONLY public."RoadmapModule" DROP CONSTRAINT IF EXISTS "RoadmapModule_pkey";
ALTER TABLE IF EXISTS ONLY public."Revision" DROP CONSTRAINT IF EXISTS "Revision_pkey";
ALTER TABLE IF EXISTS ONLY public."Note" DROP CONSTRAINT IF EXISTS "Note_pkey";
ALTER TABLE IF EXISTS ONLY public."Habit" DROP CONSTRAINT IF EXISTS "Habit_pkey";
ALTER TABLE IF EXISTS ONLY public."HabitLog" DROP CONSTRAINT IF EXISTS "HabitLog_pkey";
ALTER TABLE IF EXISTS ONLY public."Folder" DROP CONSTRAINT IF EXISTS "Folder_pkey";
DROP TABLE IF EXISTS public._prisma_migrations;
DROP TABLE IF EXISTS public."TaskResource";
DROP TABLE IF EXISTS public."Task";
DROP TABLE IF EXISTS public."RoadmapModule";
DROP TABLE IF EXISTS public."Roadmap";
DROP TABLE IF EXISTS public."Revision";
DROP TABLE IF EXISTS public."Note";
DROP TABLE IF EXISTS public."HabitLog";
DROP TABLE IF EXISTS public."Habit";
DROP TABLE IF EXISTS public."Folder";
DROP TYPE IF EXISTS public."TaskStatus";
DROP TYPE IF EXISTS public."RevisionStatus";
-- *not* dropping schema, since initdb creates it
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS '';


--
-- Name: RevisionStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."RevisionStatus" AS ENUM (
    'PENDING',
    'COMPLETED',
    'SKIPPED'
);


--
-- Name: TaskStatus; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."TaskStatus" AS ENUM (
    'TODO',
    'IN_PROGRESS',
    'COMPLETED',
    'ARCHIVED'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Folder; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Folder" (
    id text NOT NULL,
    "userId" text NOT NULL,
    name text NOT NULL,
    "parentId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Habit; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Habit" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "skipWeekends" boolean DEFAULT false NOT NULL,
    "bestStreak" integer DEFAULT 0 NOT NULL
);


--
-- Name: HabitLog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."HabitLog" (
    id text NOT NULL,
    "habitId" text NOT NULL,
    date date NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: Note; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Note" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    content text,
    "folderId" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Revision; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Revision" (
    id text NOT NULL,
    "taskId" text NOT NULL,
    "userId" text NOT NULL,
    "revisionNumber" integer DEFAULT 0 NOT NULL,
    "scheduledAt" timestamp(3) without time zone NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "intervalDays" integer DEFAULT 1 NOT NULL,
    notes text,
    status public."RevisionStatus" DEFAULT 'PENDING'::public."RevisionStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Roadmap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Roadmap" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    "estimatedTime" text,
    resources text[],
    status text DEFAULT 'IN_PROGRESS'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: RoadmapModule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."RoadmapModule" (
    id text NOT NULL,
    "roadmapId" text NOT NULL,
    title text NOT NULL,
    description text,
    status text DEFAULT 'PLANNED'::text NOT NULL,
    "order" integer NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


--
-- Name: Task; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Task" (
    id text NOT NULL,
    "userId" text NOT NULL,
    title text NOT NULL,
    description text,
    notes text,
    "dueDate" timestamp(3) without time zone,
    status public."TaskStatus" DEFAULT 'TODO'::public."TaskStatus" NOT NULL,
    "completedAt" timestamp(3) without time zone,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "estimatedMinutes" integer,
    "actualMinutes" integer,
    "startedAt" timestamp(3) without time zone,
    "isPinned" boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL
);


--
-- Name: TaskResource; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TaskResource" (
    id text NOT NULL,
    "taskId" text NOT NULL,
    url text NOT NULL,
    title text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: -
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


--
-- Data for Name: Folder; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Folder" (id, "userId", name, "parentId", "createdAt", "updatedAt") FROM stdin;
cmrk7d5ka000104lh6ff4jh03	f127c8cd-f56a-4550-91b3-c42424fa186d	Git & Github	\N	2026-07-14 05:20:27.754	2026-07-14 05:20:27.754
\.


--
-- Data for Name: Habit; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Habit" (id, "userId", title, description, "createdAt", "updatedAt", "skipWeekends", "bestStreak") FROM stdin;
cmravwpth000504kvuxncbfqk	a42c60d5-417e-40fa-b362-d89b0a7ed42f	DSA	\N	2026-07-07 16:49:49.493	2026-07-07 16:49:49.493	f	0
cmravx7jk000604kvivsm03yn	a42c60d5-417e-40fa-b362-d89b0a7ed42f	AI	\N	2026-07-07 16:50:12.464	2026-07-07 16:50:12.464	f	0
cmrayzgfl000004k0nxjda78m	f127c8cd-f56a-4550-91b3-c42424fa186d	Follow CN Series [ Chai aur Code ]	\N	2026-07-07 18:15:56.145	2026-07-07 18:15:56.145	f	0
cmrt8ekew000004l3sgh4jpkd	b7ff7ef1-b373-48c9-a56d-064425fbab3b	No smoking day	\N	2026-07-20 12:59:28.856	2026-07-20 12:59:28.856	f	0
cmrjjhva400006bycr5rovy27	f127c8cd-f56a-4550-91b3-c42424fa186d	One Git Topic Daily	Use these websites to practice: \n\n- https://ohmygit.org/\n- https://game4git.games/\n- https://www.makeuseof.com/git-learn-interactive-resources/	2026-07-13 18:12:16.924	2026-07-25 16:37:39.978	f	3
cmrcf02vy000004l23va5gf1b	f127c8cd-f56a-4550-91b3-c42424fa186d	One System Design Concept Daily	- Techprep Channel YT [ 30 Days Challenge ]	2026-07-08 18:32:05.278	2026-07-25 16:38:57.71	f	7
cmscsbjvj000004jyzp0uqf3p	b7ff7ef1-b373-48c9-a56d-064425fbab3b	10 stock Indian market	\N	2026-08-03 05:24:37.855	2026-08-03 05:24:37.855	f	0
cmscs005d000004l82incshtg	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Gold analysis	\N	2026-08-03 05:15:39.073	2026-08-03 15:12:08.182	t	1
cms8hq160000004ie8a99p3nd	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Home Workout	\N	2026-07-31 05:16:52.968	2026-08-04 11:34:26.316	f	3
cmrb224dl000004iicqqg9gpe	f127c8cd-f56a-4550-91b3-c42424fa186d	Track expenses	Add you overall expense everyday in any money tracker application	2026-07-07 19:41:59.337	2026-07-25 18:02:09.475	f	18
cmsfre959000204jwzqlae23q	bae0143b-febc-4b92-8ece-7ba323963550	Lat pull down daily	\N	2026-08-05 07:22:02.829	2026-08-05 07:22:11.21	f	1
cmrblygek000304kzuwgoq02s	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Analysis	\N	2026-07-08 04:59:00.62	2026-07-27 03:21:58.49	f	5
cmrc2jtpn000004iit0gfs0hy	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Diary review	\N	2026-07-08 12:43:31.499	2026-07-27 04:38:28.687	f	5
cmrblzwcj000504kz7a1be104	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Journal	\N	2026-07-08 05:00:07.939	2026-08-01 13:52:16.249	f	7
cmru3kvuq000204l87h1wf2o8	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Fill Market Observation worksheet	\N	2026-07-21 03:32:11.714	2026-08-01 13:52:35.606	f	5
\.


--
-- Data for Name: HabitLog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."HabitLog" (id, "habitId", date, "createdAt") FROM stdin;
cmravxibk000804kvk0bjgmv9	cmravwpth000504kvuxncbfqk	2026-07-07	2026-07-07 16:50:26.432
cmrazczqr000104k0601g1jgx	cmrayzgfl000004k0nxjda78m	2026-07-07	2026-07-07 18:26:27.699
cmrblyml9000404kzukx2wmo0	cmrblygek000304kzuwgoq02s	2026-07-08	2026-07-08 04:59:08.637
cmrc6ekss000104jxdbj7y096	cmrc2jtpn000004iit0gfs0hy	2026-07-08	2026-07-08 14:31:25.132
cmrcc45q9000004jltsn52mpb	cmrblzwcj000504kz7a1be104	2026-07-08	2026-07-08 17:11:16.738
cmrcdso79000004l1qzvg9e7c	cmrb224dl000004iicqqg9gpe	2026-07-08	2026-07-08 17:58:20.037
cmrcemx23000004jodcqc8iqd	cmrayzgfl000004k0nxjda78m	2026-07-08	2026-07-08 18:21:51.195
cmrcvcu00000004k0aluvqbaf	cmrblygek000304kzuwgoq02s	2026-07-09	2026-07-09 02:09:54.144
cmrdowm6m000004l92jwmaabb	cmrb224dl000004iicqqg9gpe	2026-07-09	2026-07-09 15:57:05.999
cmrdrort0000004ikjikhwl6m	cmrayzgfl000004k0nxjda78m	2026-07-09	2026-07-09 17:14:58.884
cmrdvn7vl0000a7ycfked81rh	cmrcf02vy000004l23va5gf1b	2026-07-09	2026-07-09 19:05:44.865
cmrf26162000004l7q6i4i1er	cmrblygek000304kzuwgoq02s	2026-07-10	2026-07-10 14:56:06.506
cmrf8nulj000004laejv7reue	cmrayzgfl000004k0nxjda78m	2026-07-10	2026-07-10 17:57:55.495
cmrf8rs6w000104laskum3xaf	cmrb224dl000004iicqqg9gpe	2026-07-10	2026-07-10 18:00:59
cmrf9evw1000004lbwftf5sqn	cmrcf02vy000004l23va5gf1b	2026-07-10	2026-07-10 18:18:56.881
cmrgoeq3y000004joj7zt4ikx	cmrb224dl000004iicqqg9gpe	2026-07-11	2026-07-11 18:06:29.806
cmrgp1we9000004jpbn9vmb91	cmrayzgfl000004k0nxjda78m	2026-07-11	2026-07-11 18:24:31.041
cmrgp20qu000104jpnltp2jqk	cmrcf02vy000004l23va5gf1b	2026-07-11	2026-07-11 18:24:36.678
cmrhsecg0000004l5kl0sv24b	cmrayzgfl000004k0nxjda78m	2026-07-12	2026-07-12 12:45:56.736
cmrhwj39d000004ju9puj14n3	cmravx7jk000604kvivsm03yn	2026-07-12	2026-07-12 14:41:36.577
cmrhwj519000104ju73hgydae	cmravwpth000504kvuxncbfqk	2026-07-12	2026-07-12 14:41:38.878
cmri3y6uw000danycglvvip04	cmrcf02vy000004l23va5gf1b	2026-07-12	2026-07-12 18:09:18.392
cmri41a6x000eanyc57d1zqis	cmrb224dl000004iicqqg9gpe	2026-07-12	2026-07-12 18:11:42.681
cmriodt2z000004l3r2jaq9kc	cmrblygek000304kzuwgoq02s	2026-07-13	2026-07-13 03:41:19.355
cmriodur3000104l3icmv3r6x	cmrc2jtpn000004iit0gfs0hy	2026-07-13	2026-07-13 03:41:21.519
cmrjfghu3000005l4p1beubod	cmravwpth000504kvuxncbfqk	2026-07-13	2026-07-13 16:19:14.38
cmrjgmvgu000004joi1kmmlqd	cmrb224dl000004iicqqg9gpe	2026-07-13	2026-07-13 16:52:11.598
cmrjh3b71000004juxtmmfisa	cmrayzgfl000004k0nxjda78m	2026-07-13	2026-07-13 17:04:58.477
cmrji8yg6000004jrpij9r6kd	cmrcf02vy000004l23va5gf1b	2026-07-13	2026-07-13 17:37:21.51
cmrjjueew00046bycvjvkipbw	cmrjjhva400006bycr5rovy27	2026-07-13	2026-07-13 18:22:01.592
cmrjzn9eh000004juhvfru06r	cmravwpth000504kvuxncbfqk	2026-07-14	2026-07-14 01:44:22.361
cmrk3ablz000004jrmx89sv2e	cmravx7jk000604kvivsm03yn	2026-07-14	2026-07-14 03:26:17.159
cmrk4z2n6000004i5lajx49ba	cmrblygek000304kzuwgoq02s	2026-07-14	2026-07-14 04:13:31.554
cmrkax1n3000004jxxeapbyxn	cmrjjhva400006bycr5rovy27	2026-07-14	2026-07-14 06:59:54.639
cmrkxmb54000104ji0oge1h8l	cmrblzwcj000504kz7a1be104	2026-07-14	2026-07-14 17:35:24.904
cmrkyhmdp000004l7cf9rbrgn	cmrayzgfl000004k0nxjda78m	2026-07-14	2026-07-14 17:59:45.805
cmrkyih7q000104l79dx72m71	cmrb224dl000004iicqqg9gpe	2026-07-14	2026-07-14 18:00:25.766
cmrkzayw3000004jr8ofgrncu	cmrcf02vy000004l23va5gf1b	2026-07-14	2026-07-14 18:22:35.043
cmrm1x70j000004lbz505biqj	cmravwpth000504kvuxncbfqk	2026-07-15	2026-07-15 12:23:37.411
cmrm8sb13000004jymfy959vy	cmrblygek000304kzuwgoq02s	2026-07-15	2026-07-15 15:35:46.647
cmrm8scn7000104jyoxbqh1no	cmrblzwcj000504kz7a1be104	2026-07-15	2026-07-15 15:35:48.739
cmrm8scrf000204jyujt0p9vj	cmrc2jtpn000004iit0gfs0hy	2026-07-15	2026-07-15 15:35:48.891
cmrmbu0lk000004ky8fcs12yi	cmravx7jk000604kvivsm03yn	2026-07-15	2026-07-15 17:01:05.288
cmrmc1zbk000004jp57e5ek02	cmrb224dl000004iicqqg9gpe	2026-07-15	2026-07-15 17:07:16.88
cmrmc9sya000004lal5y5rbr3	cmrayzgfl000004k0nxjda78m	2026-07-15	2026-07-15 17:13:21.874
cmrmenn1a000004l1fe1vr8n5	cmrcf02vy000004l23va5gf1b	2026-07-15	2026-07-15 18:20:06.622
cmrmennbg000004ieoa5xxwgz	cmrjjhva400006bycr5rovy27	2026-07-15	2026-07-15 18:20:06.988
cmrmywpy8000004kw26oedc4u	cmrblygek000304kzuwgoq02s	2026-07-16	2026-07-16 03:47:02.624
cmrmywrr6000104kwer6ll9y4	cmrc2jtpn000004iit0gfs0hy	2026-07-16	2026-07-16 03:47:04.962
cmrns0iuj000004l4i1yy19f1	cmrblzwcj000504kz7a1be104	2026-07-16	2026-07-16 17:21:48.907
cmrntw6yv000004kwvqcoygx0	cmrb224dl000004iicqqg9gpe	2026-07-16	2026-07-16 18:14:26.119
cmrnuc02i000004l7i1tbzo7t	cmravx7jk000604kvivsm03yn	2026-07-16	2026-07-16 18:26:43.674
cmrnuc232000104l7bm0o286l	cmravwpth000504kvuxncbfqk	2026-07-16	2026-07-16 18:26:46.286
cmrot0i9e000004jqy58fhdo0	cmravx7jk000604kvivsm03yn	2026-07-17	2026-07-17 10:37:33.938
cmrp0v12i000004juroaz65bg	cmrblygek000304kzuwgoq02s	2026-07-17	2026-07-17 14:17:15.306
cmrp0v2gk000104juipsr0c6g	cmrblzwcj000504kz7a1be104	2026-07-17	2026-07-17 14:17:17.108
cmrp0v2sh000204jur3d7en4v	cmrc2jtpn000004iit0gfs0hy	2026-07-17	2026-07-17 14:17:17.537
cmrq4rw0z000004l0kk8wvvgu	cmravx7jk000604kvivsm03yn	2026-07-18	2026-07-18 08:54:33.443
cmrq4rxxy000104l0ihdt80mw	cmravwpth000504kvuxncbfqk	2026-07-18	2026-07-18 08:54:35.926
cmrq7liwm000004inud49qyow	cmrb224dl000004iicqqg9gpe	2026-07-18	2026-07-18 10:13:35.35
cmrs3vhcs000004la52e1ogt6	cmravx7jk000604kvivsm03yn	2026-07-19	2026-07-19 18:04:53.789
cmrs3vjfj000104la9d27poxk	cmravwpth000504kvuxncbfqk	2026-07-19	2026-07-19 18:04:56.48
cmrswmv2r000004lbzjqwl8c8	cmravx7jk000604kvivsm03yn	2026-07-20	2026-07-20 07:30:00.532
cmrt8368j000004l5xnb4bt3v	cmrblygek000304kzuwgoq02s	2026-07-20	2026-07-20 12:50:37.267
cmrt839un000104l5ivlwfy4e	cmrc2jtpn000004iit0gfs0hy	2026-07-20	2026-07-20 12:50:41.951
cmrthsuqw000004jmo12qod9v	cmrblzwcj000504kz7a1be104	2026-07-20	2026-07-20 17:22:31.976
cmru3kc2i000004l8qkz8irzq	cmrblygek000304kzuwgoq02s	2026-07-21	2026-07-21 03:31:46.074
cmru3kecl000104l8e08tyesy	cmrc2jtpn000004iit0gfs0hy	2026-07-21	2026-07-21 03:31:49.029
cmruivs56000004lap6ndyjeg	cmravwpth000504kvuxncbfqk	2026-07-21	2026-07-21 10:40:34.362
cmruivt8l000104la7kh3i8zc	cmravx7jk000604kvivsm03yn	2026-07-21	2026-07-21 10:40:35.781
cmruwrut1000004l5vuuv4wnu	cmrblzwcj000504kz7a1be104	2026-07-21	2026-07-21 17:09:25.813
cmrvl55vx000004jmn7qh258x	cmrblygek000304kzuwgoq02s	2026-07-22	2026-07-22 04:31:37.485
cmrvl92pm000204jm2wyaw0q7	cmrc2jtpn000004iit0gfs0hy	2026-07-22	2026-07-22 04:34:39.994
cmrw6dbch000004ldr9a8ufhw	cmravx7jk000604kvivsm03yn	2026-07-22	2026-07-22 14:25:49.745
cmrwaq5z8000004lbiksejp7b	cmru3kvuq000204l87h1wf2o8	2026-07-22	2026-07-22 16:27:47.78
cmrwcuulr000004l9m31k2md5	cmrblzwcj000504kz7a1be104	2026-07-22	2026-07-22 17:27:25.551
cmrxr9w1j000004i9klh91mup	cmrblygek000304kzuwgoq02s	2026-07-23	2026-07-23 16:58:48.056
cmrxr9wpb000104i9awmil7sj	cmrblzwcj000504kz7a1be104	2026-07-23	2026-07-23 16:58:48.911
cmrxr9xst000204i9cndjep3w	cmrc2jtpn000004iit0gfs0hy	2026-07-23	2026-07-23 16:58:50.333
cmrxrr2a1000004l2w02ue2gj	cmru3kvuq000204l87h1wf2o8	2026-07-23	2026-07-23 17:12:09.289
cmryezkek000004l7qiuug2o4	cmrblygek000304kzuwgoq02s	2026-07-24	2026-07-24 04:02:37.196
cmrym8w5c000004lf5ost4l7m	cmrc2jtpn000004iit0gfs0hy	2026-07-24	2026-07-24 07:25:49.632
cmrz6n486000004l5pzdkarqy	cmru3kvuq000204l87h1wf2o8	2026-07-24	2026-07-24 16:56:45.606
cmrz6n62d000104l5bcdn5w70	cmrblzwcj000504kz7a1be104	2026-07-24	2026-07-24 16:56:47.989
cms0oaefz000004lazi6mjnx7	cmrb224dl000004iicqqg9gpe	2026-07-25	2026-07-25 17:58:31.583
cms0oemhd000104la1ba14hny	cmrb224dl000004iicqqg9gpe	2026-07-17	2026-07-25 18:01:48.626
cms0oeptv000204lakd78gpx4	cmrb224dl000004iicqqg9gpe	2026-07-19	2026-07-25 18:01:52.963
cms0oerb1000304latz5eg9wy	cmrb224dl000004iicqqg9gpe	2026-07-20	2026-07-25 18:01:54.877
cms0oewx7000404la1asolexr	cmrb224dl000004iicqqg9gpe	2026-07-21	2026-07-25 18:02:02.156
cms0oeynv000504lawh6bmffn	cmrb224dl000004iicqqg9gpe	2026-07-22	2026-07-25 18:02:04.411
cms0of0e3000604la6xzk71zp	cmrb224dl000004iicqqg9gpe	2026-07-23	2026-07-25 18:02:06.651
cms0of1x3000704la9tp5wfm5	cmrb224dl000004iicqqg9gpe	2026-07-24	2026-07-25 18:02:08.631
cms1bk3r0000404ldxsvo2ytr	cmrblzwcj000504kz7a1be104	2026-07-26	2026-07-26 04:49:55.452
cms2nutz3000004kz5j2enaur	cmrblygek000304kzuwgoq02s	2026-07-27	2026-07-27 03:21:57.567
cms2ql7ui000004jsc9574zmh	cmrc2jtpn000004iit0gfs0hy	2026-07-27	2026-07-27 04:38:27.834
cms3joute000004l1hyfvzsse	cmru3kvuq000204l87h1wf2o8	2026-07-27	2026-07-27 18:13:06.434
cms3jozqu000104l1nrn2o1y1	cmrblzwcj000504kz7a1be104	2026-07-27	2026-07-27 18:13:12.822
cms4nhdbx000004jlw46ejqmt	cmrblygek000304kzuwgoq02s	2026-07-28	2026-07-28 12:47:01.821
cms4nhglg000104jl8a2zhn1u	cmrc2jtpn000004iit0gfs0hy	2026-07-28	2026-07-28 12:47:06.052
cms4wohf2000004l72pl041gk	cmru3kvuq000204l87h1wf2o8	2026-07-28	2026-07-28 17:04:30.254
cms4womtl000104l7n4gjmskr	cmrblzwcj000504kz7a1be104	2026-07-28	2026-07-28 17:04:37.258
cms5ilkch000004k5aefsf7g0	cmrblygek000304kzuwgoq02s	2026-07-29	2026-07-29 03:18:05.633
cms5illrk000104k5cuxyvz5d	cmrc2jtpn000004iit0gfs0hy	2026-07-29	2026-07-29 03:18:07.472
cms6cl8ez000004l266yjbeuf	cmrblzwcj000504kz7a1be104	2026-07-29	2026-07-29 17:17:38.652
cms6clizp000204l26e73y8qt	cmru3kvuq000204l87h1wf2o8	2026-07-29	2026-07-29 17:17:52.357
cms70js9o000004kt0e6luagx	cmrblygek000304kzuwgoq02s	2026-07-30	2026-07-30 04:28:21.852
cms70jtso000104kt9xwi6s5j	cmrblzwcj000504kz7a1be104	2026-07-30	2026-07-30 04:28:23.832
cms70ju9x000204kthkwgzu76	cmrc2jtpn000004iit0gfs0hy	2026-07-30	2026-07-30 04:28:24.453
cms7siah2000004l9rpr15qsf	cmru3kvuq000204l87h1wf2o8	2026-07-30	2026-07-30 17:31:01.383
cms8hqdtt000104iellc58s4i	cmrblygek000304kzuwgoq02s	2026-07-31	2026-07-31 05:17:09.377
cms8hqf8n000204iessvc2crm	cmrc2jtpn000004iit0gfs0hy	2026-07-31	2026-07-31 05:17:11.207
cms989it3000004l5utqp7auh	cmrblzwcj000504kz7a1be104	2026-07-31	2026-07-31 17:39:52.312
cms989ki0000104l54fadxfd4	cmru3kvuq000204l87h1wf2o8	2026-07-31	2026-07-31 17:39:54.504
cmsafknok000004ju5ye1qin8	cmrblzwcj000504kz7a1be104	2026-08-01	2026-08-01 13:52:15.332
cmscpit1v000004i8x7qhpj4a	cmrblygek000304kzuwgoq02s	2026-08-03	2026-08-03 04:06:17.491
cmscpitmq000004l7rnr6ursn	cmrblzwcj000504kz7a1be104	2026-08-03	2026-08-03 04:06:18.242
cmscsfcyv000004jlljo07iyq	cms8hq160000004ie8a99p3nd	2026-08-02	2026-08-03 05:27:35.527
cmscsgqsd000104jyuseugm8z	cmrc2jtpn000004iit0gfs0hy	2026-08-03	2026-08-03 05:28:40.093
cmsd5qruw000004jxxltcfnxk	cms8hq160000004ie8a99p3nd	2026-08-03	2026-08-03 11:40:23.048
cmsddb2hv000004jog3he0oz4	cmscs005d000004l82incshtg	2026-08-03	2026-08-03 15:12:07.267
cmsdgfr1b000004l2e4buo3z9	cmru3kvuq000204l87h1wf2o8	2026-08-03	2026-08-03 16:39:44.543
cmsejx9r7000004l9d9mr12cr	cmrblygek000304kzuwgoq02s	2026-08-04	2026-08-04 11:05:06.979
cmsekyykz000004lad8d7m5iq	cms8hq160000004ie8a99p3nd	2026-08-04	2026-08-04 11:34:25.427
cmsfreey1000304jwh3fltiq5	cmsfre959000204jwzqlae23q	2026-08-05	2026-08-05 07:22:10.345
cmsgh94s8000004kvgqi7y7fr	cmrjjhva400006bycr5rovy27	2026-08-06	2026-08-05 19:25:53.913
\.


--
-- Data for Name: Note; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Note" (id, "userId", title, content, "folderId", "createdAt", "updatedAt") FROM stdin;
cmrk7dy0b000404lhtt3wnq6q	f127c8cd-f56a-4550-91b3-c42424fa186d	Basic Commands	{"root":{"children":[{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Untracked ------- Unstaged -------  Staged -------  Committed ------- Pushed ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git status","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] - Shows current state of the repository. ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git add","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] - Move tracked files to staging area | [ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git add .","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] - to add all the files | [ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git add filename.ext","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] for individual","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git commit","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] - Move files from ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"staged","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"committed","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":". Changes are recorded in local git repository","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"[","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":" git push","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] - Move committed changes from local to remote repository like github/azure/gitlab etc. [ ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"git push -u origin main","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ] | ( ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"-u","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" : --set-upstream ) | ( origin : alias for the remote repository ) | ( main : branch name ) ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"textFormat":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	cmrk7d5ka000104lh6ff4jh03	2026-07-14 05:21:04.619	2026-08-05 19:26:33.667
cmrxf6ae0000204js5a0o2ddf	a42c60d5-417e-40fa-b362-d89b0a7ed42f	Junit	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 1 — JUnit Fundamentals","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Introduction to JUnit","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"JUnit 5 Architecture","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Project Setup (Maven/Gradle)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Lifecycle","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Assertions","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Naming Best Practices","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 2 — Writing Unit Tests","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Test","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Assertions","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"assertThrows","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"assertAll","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"assertTimeout","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Testing Utility Classes","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Testing Business Logic","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 3 — Test Lifecycle","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@BeforeEach","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@AfterEach","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@BeforeAll","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@AfterAll","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Test Instance Lifecycle","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 4 — Parameterized Tests","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@ParameterizedTest","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@ValueSource","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@CsvSource","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@MethodSource","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@EnumSource","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 5 — Nested & Repeated Tests","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Nested","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@RepeatedTest","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Display Names","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 6 — Mockito","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Mocking","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Mock","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@InjectMocks","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Spy","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Captor","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Stubbing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Verification","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Argument Matchers","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 7 — Spring Boot Testing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@SpringBootTest","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@WebMvcTest","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@DataJpaTest","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@MockBean","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"MockMvc","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Repository Testing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Controller Testing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Service Layer Testing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	\N	2026-07-23 11:20:04.632	2026-07-23 11:21:25.729
cmrxf1z42000304kz0nic66qc	a42c60d5-417e-40fa-b362-d89b0a7ed42f	Redis	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 1 — Redis Fundamentals","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Redis?","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Why Redis?","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Architecture","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Installation","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis CLI","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Persistence Overview","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project:","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" None","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 2 — Redis Data Types","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Strings","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Hashes","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Lists","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sets","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sorted Sets","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Bitmaps","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"HyperLogLog","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Streams","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"RedisJSON","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":9}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Build a mini key-value database","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 3 — CRUD Operations","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"SET","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"GET","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"DEL","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"EXISTS","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"EXPIRE","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"TTL","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"INCR","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"DECR","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Build a cache service","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 4 — Persistence","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"RDB","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"AOF","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Snapshots","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Recovery","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 5 — Caching","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cache Aside","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Read Through","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Write Through","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Write Back","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cache Invalidation","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"TTL","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Eviction Policies","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Product Cache API","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 6 — Redis with Spring Boot","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Spring Data Redis","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"RedisTemplate","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"StringRedisTemplate","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"@Cacheable","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"@CachePut","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"@CacheEvict","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cache Spring Boot APIs","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 7 — Pub/Sub","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Publisher","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Subscriber","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Channels","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Notifications","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Live Notification Service","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 8 — Distributed Features","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Distributed Locks","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"RedLock","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Rate Limiting","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Leader Election","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Distributed Rate Limiter","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 9 — Scaling Redis","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Replication","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sentinel","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cluster","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sharding","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"High Availability","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Deploy a Redis Cluster","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Module 10 — Production","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Monitoring","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Security","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Performance Tuning","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Memory Optimization","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Best Practices","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Project","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Production-ready Redis Deployment","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Interview Topics Checklist","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"heading","version":1,"tag":"h2"},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What is Redis?","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis vs Memcached","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Why is Redis so fast?","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis data structures","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cache Aside Pattern","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"TTL and expiration","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cache Invalidation","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Persistence (RDB vs AOF)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Pub/Sub","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":9},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Distributed Locks","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":10},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Sentinel","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":11},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Cluster","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":12},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Replication","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":13},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Eviction Policies","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":14},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis Streams (basics)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":15},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Redis in Spring Boot","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":16},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"RedisTemplate","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" vs ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"StringRedisTemplate","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":17},{"children":[{"detail":0,"format":16,"mode":"normal","style":"","text":"@Cacheable","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":", ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"@CachePut","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":", ","type":"text","version":1},{"detail":0,"format":16,"mode":"normal","style":"","text":"@CacheEvict","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":18},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Common production use cases (sessions, caching, rate limiting, leader election)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":19}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	\N	2026-07-23 11:16:43.394	2026-07-23 11:18:24.01
\.


--
-- Data for Name: Revision; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Revision" (id, "taskId", "userId", "revisionNumber", "scheduledAt", "completedAt", "intervalDays", notes, status, "createdAt", "updatedAt") FROM stdin;
cmrah8dee0001c1uklipave6a	cmr91gcgo000004ju97mqa7xt	f127c8cd-f56a-4550-91b3-c42424fa186d	0	2026-07-08 09:58:58.984	\N	1	\N	SKIPPED	2026-07-07 09:58:59.03	2026-07-07 13:43:22.96
cmrblwu5c000204kzs74sjum7	cmrbj2d0s000004lacz9uz18k	b7ff7ef1-b373-48c9-a56d-064425fbab3b	0	2026-07-09 00:00:00	2026-07-08 04:57:57.906	1	\N	COMPLETED	2026-07-08 04:57:45.12	2026-07-08 04:57:57.908
cmrb1zfmc000004l85zfq9zju	cmr91gcgo000004ju97mqa7xt	f127c8cd-f56a-4550-91b3-c42424fa186d	1	2026-07-08 19:39:53.513	\N	1	\N	SKIPPED	2026-07-07 19:39:53.94	2026-07-09 19:28:41.861
cmsfrdtvp000104jwgd6xubhh	cmsfrdoyz000004jweul4yik8	bae0143b-febc-4b92-8ece-7ba323963550	0	2026-08-06 07:21:42.588	\N	1	\N	PENDING	2026-08-05 07:21:43.045	2026-08-05 07:21:43.045
\.


--
-- Data for Name: Roadmap; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Roadmap" (id, "userId", title, description, "estimatedTime", resources, status, "createdAt", "updatedAt") FROM stdin;
bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	f127c8cd-f56a-4550-91b3-c42424fa186d	Firmware and Electronics	Learn electronics, digital systems, firmware development. Build some projects and try to implement hard things yourself.\n\nFree High-Quality Resources : \n\n1. Official Arduino documentation and examples |\n2. freeCodeCamp Arduino course (YouTube) |\n3. “Arduino Step by Step” style project series |\n4. GreatScott! / Electronoobs / Andreas Spiess (YouTube) for electronics intuition |\n5. PlatformIO documentation |\n6. MCU / sensor datasheets (practice reading them)	\N	{}	PLANNED	2026-08-05 19:29:00.312	2026-08-05 19:42:11.62
84e0c212-e020-46ca-b08b-6e512d425153	f127c8cd-f56a-4550-91b3-c42424fa186d	System Design	Learn system design concepts and how to apply them in different problems. Keep finding good resources and add them in your roadmap to avoid forgetting or losing them.	2 Months	{}	PLANNED	2026-07-08 20:32:36.82	2026-07-08 20:32:36.82
346d16be-5552-4afa-9f5c-9c945f08d4e0	a42c60d5-417e-40fa-b362-d89b0a7ed42f	Learn Interview Ready Java	Java	2 month	{}	PLANNED	2026-07-09 02:41:24.694	2026-07-09 02:41:32.721
17475092-ae38-4b21-918d-ab4749ebfa6d	f127c8cd-f56a-4550-91b3-c42424fa186d	Git & Github	Learn git essentials, some less known git commands and how git is used in prod-environments.	\N	{}	PLANNED	2026-07-13 18:14:00.31	2026-07-13 18:14:00.31
d8bcdfa5-42e1-444f-b159-1fccf6d641c3	a42c60d5-417e-40fa-b362-d89b0a7ed42f	AWS	EC2, S3, IAM, RDS, VPC, CloudWatch, Route 53, Elastic Load Balancer (ALB/NLB), ECS, EKS, SQS, Lambda	\N	{}	PLANNED	2026-07-23 10:59:55.986	2026-07-23 11:00:53.761
a50a292d-9024-40db-b125-817e330a3b40	a42c60d5-417e-40fa-b362-d89b0a7ed42f	CI/CD	Jenkins, Docker, Kubernetes, Prometheus, Grafana	\N	{}	PLANNED	2026-07-23 11:02:29.983	2026-07-23 11:02:29.983
4bfd0797-b55c-43a6-a7f0-f05bddd0cdd3	a42c60d5-417e-40fa-b362-d89b0a7ed42f	Spring boot	Spring Core, Spring Framework, Spring Boot, IoC, Dependency Injection (DI), Bean Lifecycle, Bean Scopes, Spring Annotations, Spring MVC, Global Exception Handling, Spring Data JPA, Hibernate, JDBC, Transactions, Spring Security, JWT Authentication, OAuth2, Spring AOP, Caching, Spring Cache, Async Processing, Scheduling, Spring Profiles, Configuration Properties, Auto Configuration, Starter Dependencies, Embedded Tomcat, Spring Boot Actuator, Logging, Spring Testing (JUnit, Mockito, MockMvc), Spring Cloud, Microservices, Eureka, Config Server, API Gateway, OpenFeign, Resilience4j, Circuit Breaker,	\N	{}	PLANNED	2026-07-23 11:05:45.489	2026-07-23 11:05:45.489
611b5b63-f19e-49e2-9c3c-1779db183eb4	a42c60d5-417e-40fa-b362-d89b0a7ed42f	AI	LLMs, Prompt Engineering, AI Agents, Agentic AI, RAG (Retrieval-Augmented Generation), Embeddings, Vector Databases, Semantic Search, Model Context Protocol (MCP), Function/Tool Calling, Structured Output, Context Windows, Tokenization, Fine-tuning (basics), AI Evaluation (Evals), Hallucinations & Guardrails, LangChain, LangGraph, LlamaIndex, OpenAI API, Anthropic API, Google Gemini API, Ollama, Hugging Face, Transformers (basics), FastAPI, Python, Async Programming, PostgreSQL + pgvector, Pinecone/Qdrant/Weaviate, Redis, Elasticsearch/OpenSearch, Document Parsing, Chunking Strategies, Reranking, Prompt Templates, Memory Management, Multi-Agent Systems, AI Workflows	\N	{}	PLANNED	2026-07-23 11:07:12.23	2026-07-23 11:07:12.23
71f00db3-993d-47a0-8ff3-742bc38c1b93	a42c60d5-417e-40fa-b362-d89b0a7ed42f	Advance	Redis, Kafka, Rabbit MQ, Testing	\N	{}	PLANNED	2026-07-23 11:09:28.905	2026-07-23 11:09:28.905
c6629213-927a-47a9-8853-0cbcdef53cd6	a42c60d5-417e-40fa-b362-d89b0a7ed42f	HLD	System Design Fundamentals, Functional Requirements, Non-Functional Requirements, Capacity Estimation, API Design, Database Design, SQL vs NoSQL, Database Indexing, Database Replication, Database Sharding, Caching, Cache Invalidation, Redis, Load Balancer, Reverse Proxy, CDN, Horizontal Scaling, Vertical Scaling, Stateless Services, Session Management, Rate Limiting, Message Queues, Kafka, RabbitMQ, Event-Driven Architecture, Microservices, API Gateway, Service Discovery, Circuit Breaker, Idempotency, Distributed Transactions (Basics), CAP Theorem, Consistency Models, Logging, Monitoring, Health Checks, Authentication, Authorization, JWT, File Storage (S3), Search (Elasticsearch Basics), High Availability, Fault Tolerance, Scalability, Reliability, Latency, Throughput, Single Point of Failure (SPOF), Read/Write Separation, Asynchronous Processing	\N	{}	PLANNED	2026-07-23 11:10:48.434	2026-07-23 11:10:48.434
f76991d7-e4e6-486a-878f-15860739bcec	a42c60d5-417e-40fa-b362-d89b0a7ed42f	LLD	SOLID Principles, Object Modeling, Class Design, UML Class Diagrams, Relationships (Association, Aggregation, Composition, Inheritance), Design Patterns (Factory, Abstract Factory, Singleton, Builder, Prototype, Strategy, Observer, Decorator, Adapter, Facade, Command, State, Template Method, Chain of Responsibility, Proxy), Dependency Injection, Immutability, Concurrency (Basics), Thread Safety	\N	{}	PLANNED	2026-07-23 11:11:17.209	2026-07-23 11:23:23.174
48ad4b83-9aa6-4dbc-83e3-fce05efc5bb9	bae0143b-febc-4b92-8ece-7ba323963550	Chill kaise kare	\N	\N	{}	PLANNED	2026-08-05 07:22:42.899	2026-08-05 07:22:42.899
8ab29f69-5d85-4d66-aa56-346f5bf894fe	f127c8cd-f56a-4550-91b3-c42424fa186d	Artificial Intelligence	Learn artificial intelligence topics, frameworks, security concepts.	\N	{}	PLANNED	2026-08-05 19:45:32.76	2026-08-05 19:45:32.76
\.


--
-- Data for Name: RoadmapModule; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."RoadmapModule" (id, "roadmapId", title, description, status, "order", "createdAt", "updatedAt") FROM stdin;
f7751f9f-c886-4a6a-85c1-6698e0f5deff	84e0c212-e020-46ca-b08b-6e512d425153	Reliability Patterns	Availability : Deployment Stamps, Geodes, Throttling, Health Endpoint Monitoring, Queue-Based Load Leveling |\n\nHigh Availability : Deployment Stamps, Geodes, Bulkhead, Health Endpoint Monitoring, Circuit Breaker |\n\nResilience : Bulkhead, Circuit Breaker, Compensating Transaction, Health Endpoint Monitoring, Leader Election, Queue-Based Load Leveling, Retry, Scheduler Agent Supervisor |\n\nSecurity : Federated Identity, Gatekeeper, Valet Key	PLANNED	17	2026-07-09 19:01:05.689	2026-07-09 19:01:23.555
1cbdeea0-1044-4563-a462-38c30ea40e64	84e0c212-e020-46ca-b08b-6e512d425153	Cloud Design Patterns	Design Implementation : Strangler Fig, Sidecar, Static Content Hosting, Leader Election, CQRS, Pipes & Filters, Ambassador, Gateway Routing, Gateway Offloading, Gateway Aggregation, External Config Store, Compute Resource Consolidation, Backends for Frontend, Anti-Corruption Layer |\n\nData Management : Valet Key, Static Content Hosting, Sharding, Materialized View, Index Table, Event Sourcing, CQRS, Cache-Aside |\n\nMessaging : Sequential Convoy, Scheduling Agent Supervisor, Queue-Based Load Leveling, Publisher/Subscriber, Priority Queue, Pipes and Filters, Competing Consumers, Choreography, Claim Check, Async Request Reply	PLANNED	16	2026-07-09 18:58:43.46	2026-07-09 19:01:44.558
0830624b-2fe8-4296-8d32-6469fa8ce816	84e0c212-e020-46ca-b08b-6e512d425153	Latency and Throughput	What is latency and throughput and what is their impact in a system ?	PLANNED	2	2026-07-09 18:14:00.193	2026-07-09 18:14:00.193
e2a21363-bf6c-40fa-acb5-bf07f44e5136	84e0c212-e020-46ca-b08b-6e512d425153	Availability and Consistency	What is CAP theorem and how it is used in different systems ?	PLANNED	3	2026-07-09 18:14:55.928	2026-07-09 18:14:55.928
b381c251-7770-44c2-b611-fcc4abee98b2	84e0c212-e020-46ca-b08b-6e512d425153	Consistency Patterns	Understanding Weak, Eventual and Strong consistency. Where to use what type of consistency pattern.	PLANNED	4	2026-07-09 18:15:50.751	2026-07-09 18:15:50.751
512c9315-1b45-473c-96e7-ea79ac1ec3a7	84e0c212-e020-46ca-b08b-6e512d425153	Availability Patterns	Fail over and Replication Pattern and their types like - Active-Active, Active-Passive OR Master-Slave & Master-Master. Availability in numbers like Three-9, Four-9 along with Availability in parallel vs sequence.	PLANNED	5	2026-07-09 18:21:59.954	2026-07-09 18:21:59.954
44c14c62-b654-4cbe-bfb2-f0a901ecaf46	84e0c212-e020-46ca-b08b-6e512d425153	Background Jobs	Understanding Event Driven and Schedule Driven Background Jobs and how results are handled.	PLANNED	6	2026-07-09 18:26:36.23	2026-07-09 18:26:36.23
2cf3fa1c-bcee-494a-9f43-ea34a1f2d84b	84e0c212-e020-46ca-b08b-6e512d425153	Domain Name System [ DNS ]	Understand how DNS works and how it contribute to the design of a system.	PLANNED	7	2026-07-09 18:27:46.008	2026-07-09 18:27:46.008
341d05e1-6fba-4bae-8ac7-433ba07b6ed3	84e0c212-e020-46ca-b08b-6e512d425153	Content Delivery Networks [ CDN ]	Understand CDN and its types like PULL and PUSH CDNs.	PLANNED	8	2026-07-09 18:28:48.443	2026-07-09 18:28:48.443
339fbb43-242f-41e7-828e-0b13da066edd	84e0c212-e020-46ca-b08b-6e512d425153	Load Balancers	Understanding load balancing and reverse proxy, Load Balancing Algorithms, Layer 7 Load Balancing, Layer 4 Load Balancing, Horizontal Scaling.	PLANNED	9	2026-07-09 18:32:08.265	2026-07-09 18:32:08.265
6d78d946-8e89-4619-852f-7d71302821e8	84e0c212-e020-46ca-b08b-6e512d425153	Application Layer and Database	Understand microservices and service discovery. Go in depth of SQL & Non-SQL databases. Topics like - Key-Value Store, Document Store, Wide Column Store, Graph Databases from No-SQL DB and Replication, Sharding, Federation, Denormalization, SQL tuning from RDBMS/ SQL DB are worth spending time.	PLANNED	10	2026-07-09 18:36:23.284	2026-07-09 18:36:23.284
1a504a74-13b6-4be5-a176-13a9672f20cd	84e0c212-e020-46ca-b08b-6e512d425153	Caching	Understand different types of Caching and their application. Go in depth of Caching strategies like - Refresh ahead, Write behind, Write through, Cache aside etc.	PLANNED	11	2026-07-09 18:48:10.476	2026-07-09 18:48:10.476
93866f69-b999-4f1f-9abe-7e9d885c5264	84e0c212-e020-46ca-b08b-6e512d425153	Asynchronism	Understand how asynchronous systems work, read about - Back Pressure, Task Queues, Message Queues	PLANNED	12	2026-07-09 18:49:04.701	2026-07-09 18:49:04.701
410a4630-1dfb-4dbb-893a-562f93dae790	84e0c212-e020-46ca-b08b-6e512d425153	Idempotent Operations	ACID Properties and how Idempotent operations work	PLANNED	13	2026-07-09 18:50:45.419	2026-07-09 18:50:45.419
17a7b191-fe0b-4590-9af6-3d9a3d6fdfa5	84e0c212-e020-46ca-b08b-6e512d425153	Communication	Understand TCP, UDP, HTTP Protocols and communication architectures like REST, gRPC, RPC, GraphQL.	PLANNED	14	2026-07-09 18:51:56.02	2026-07-09 18:51:56.02
5ddc8ea1-e916-4c04-b418-d3e2914a6c43	84e0c212-e020-46ca-b08b-6e512d425153	Performance Anti-Patterns	Topics include - Improper Instantiation, Monolithic Persistence, Noisy Neighbor, Synchronous I/O, Extraneous Fetching, Busy Database, Busy Frontend, Chatty I/O, Retry Storm, No Caching	PLANNED	15	2026-07-09 18:53:47.886	2026-07-09 18:53:47.886
ebe0cfcb-538f-4d93-94d0-5e8fc4da390b	84e0c212-e020-46ca-b08b-6e512d425153	Introduction	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Introduction to system design and ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Understanding how to approach system design questions in an interview","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":".","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	COMPLETED	0	2026-07-09 18:10:28.284	2026-07-13 17:55:19.73
b8916aec-5b47-4904-9071-7ef355eafde0	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 6: Expert / Situational Topics (As Needed)	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Learn these when you actually face the problem:","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Advanced recovery (recovering deleted commits/branches)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Custom Git aliases and productive configuration","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Git hooks (client-side and server-side)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Replacing history (git filter-repo)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sparse checkout & partial clone","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Advanced GitHub Actions (matrices, reusable workflows, OIDC)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Git internals deeper dive (plumbing vs porcelain commands)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Alternative tools: Magit, lazygit, GitKraken, etc. (optional)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	6	2026-08-05 19:25:04.57	2026-08-05 19:25:04.57
720fd1f5-9865-4520-bc0a-34209852745d	84e0c212-e020-46ca-b08b-6e512d425153	Performance and Scalability	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Core comparison between performance and scalability of any system.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Scalability & Performance Medium Article : https://tinyurl.com/2s4bu33p","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"System Design Topics : https://tinyurl.com/3th7nsw4","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	IN_PROGRESS	1	2026-07-09 18:11:50.725	2026-07-15 18:28:09.514
3590e4e9-0f88-4fb5-af7b-7600f03cd890	17475092-ae38-4b21-918d-ab4749ebfa6d	Basics	{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Understand Version Control Systems (","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"VCS","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":") and how other VCS compare to git. Also learn about ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"who developed git","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" and what is its history.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	COMPLETED	0	2026-07-13 18:16:44.921	2026-08-05 19:08:23.979
76e995ea-88fb-4467-840e-3071cc78635b	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 1: Solid Core Git	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Be completely comfortable with daily Git operations and never feel lost.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Working Tree, Staging Area (Index), and Repository","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"git status, git diff (staged vs unstaged), git log (useful flags)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Amending commits (--amend) and when it’s safe","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Undoing changes: git restore, git reset (soft/mixed/hard), git revert","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Stashing (git stash, stash pop, stash apply, named stashes)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Ignoring files properly (.gitignore, global gitignore)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Understanding detached HEAD and how to recover from it","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	1	2026-08-05 19:19:38.283	2026-08-05 19:19:38.283
eee509d7-ddb2-44cd-a5da-4584b9c1e560	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 2: Branching, Merging & Collaboration	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Work confidently in a team.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Creating, switching, renaming, and deleting branches","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Merge vs Rebase (when to use which)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Fast-forward vs non-fast-forward merges","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Resolving merge conflicts properly","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Interactive rebase (git rebase -i) — reordering, squashing, editing commits","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cherry-picking","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Common branching strategies: 1. GitHub Flow, 2. Git Flow, 3. Trunk-based development","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Pull Requests / Merge Requests workflow","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Keeping a feature branch up to date with main","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":9}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	2	2026-08-05 19:21:01.586	2026-08-05 19:21:01.586
3bda9d0c-9562-41dd-a1a5-af0b4a434020	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 3: Intermediate → Advanced Git	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Handle real-world messy situations and understand Git deeply enough to debug.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Commands & Techniques","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"git reflog (your safety net)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"git bisect (finding bugs)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"git blame / git annotate","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"git cherry and comparing branches","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Partial staging (git add -p)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Cleaning the working directory (git clean)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Submodules and subtrees (basic understanding)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Worktrees (git worktree)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Internals (Very Important)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Content-addressable storage (blobs, trees, commits, tags)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How commits form a DAG","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What HEAD, refs, and the index really are","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Object database and packfiles (high-level)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How git commit and git merge actually work under the hood","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	3	2026-08-05 19:21:46.073	2026-08-05 19:21:46.073
5175a0bb-8296-4483-9ea2-f78f195a6f59	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 4: GitHub Mastery	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Use GitHub like a professional, not just as a remote.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Repository settings & branch protection rules","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Pull Request best practices (description, reviews, draft PRs)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Code Owners (CODEOWNERS file)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"GitHub Actions (basics → intermediate) : 1. Workflows, triggers, jobs, steps | 2. Common actions (checkout, setup-node, caching, etc.) | 3. Secrets and environments","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Issues, Projects, and linking them to PRs","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Releases & Tags (semantic versioning)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"GitHub CLI (gh)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Forks vs branches, contributing to open source","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Security features: Dependabot, code scanning, secret scanning","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":9},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"GitHub Packages (basic idea)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":10}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	4	2026-08-05 19:23:25.959	2026-08-05 19:23:25.959
4fcc209a-b53f-4a71-ad65-d5d32d1bee20	17475092-ae38-4b21-918d-ab4749ebfa6d	Phase 5: Professional Practices & Workflows (Ongoing)	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Write clean history and work effectively in real teams.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Writing good commit messages (Conventional Commits)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Keeping history clean (squash vs merge vs rebase strategies)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"When to force-push (and when never to)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Signing commits (GPG / SSH signing)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Multiple remotes and upstream management","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Monorepo vs multi-repo considerations","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Handling large files (Git LFS)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Performance tips for large repositories","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	5	2026-08-05 19:24:16.076	2026-08-05 19:24:16.076
77cd8a74-16d2-4570-8ff2-a5f24a2504f4	bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	Phase 1: Foundations	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Understand voltage/current/resistance and refresh C for hardware.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Basic Electronics","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Voltage, current, resistance, Ohm’s Law (V = IR)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Series vs parallel circuits","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"What a resistor does (current limiting for LEDs)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Digital vs analog signals","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Pull-up / pull-down resistors and why they matter","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"How to use a multimeter (voltage, continuity, resistance)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Read a simple schematic (LED + resistor + button)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"C for Embedded (refresh + hardware focus)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Data types and their sizes (especially uint8_t, int16_t, etc.)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Pointers, arrays, structs, enums","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Bitwise operations (AND, OR, XOR, shifts, masks) — critical for registers","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"volatile keyword and why it exists","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Memory: stack vs heap vs global/static (and why malloc is dangerous on MCUs)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Preprocessor directives (#define, #ifdef)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Practice","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Write pure C programs on PC for bit manipulation and pointer exercises","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Blink an LED on Arduino (classic “Hello World”)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	0	2026-08-05 19:35:44.745	2026-08-05 19:35:44.745
baa966be-da91-4415-9afc-aa7aa5b09247	bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	Phase 2: Arduino Core + Digital/Analog I/O	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Comfortable controlling pins and reading inputs.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Arduino IDE / PlatformIO setup and upload process","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"setup() and loop() structure","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Digital output: pinMode, digitalWrite","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Digital input: digitalRead, buttons with debouncing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Analog input: analogRead (ADC), potentiometer / LDR","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Analog output / PWM: analogWrite (LED brightness, motor speed)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Serial communication: Serial.begin, Serial.print, Serial Monitor for debugging","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Timing: delay() (know its limitations), millis() for non-blocking code","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":8},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Basic state machines (simple if/else or switch for LED patterns, traffic light, etc.)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":9}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Mini Projects (do at least 4)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Blinking LED patterns / traffic light","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Button-controlled LED with proper debouncing","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Potentiometer-controlled LED brightness","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Light-dependent LED (LDR)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Simple voltage reader displayed on Serial","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	1	2026-08-05 19:36:16.5	2026-08-05 19:36:16.5
95d040d5-6f7d-4be5-b54e-0e9fab57cfa1	bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	Phase 3: Sensors, Actuators & Communication Protocols	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Talk to real hardware and understand common buses.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Sensors & Actuators","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Temperature/humidity (DHT)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Distance (HC-SR04)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Servo motor control","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Buzzer / relay (digital on/off)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Basic display (I2C OLED or 16×2 LCD)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Communication Protocols (must know these deeply)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"UART: how it works, baud rate, TX/RX, common uses (debug, GPS, Bluetooth modules)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"I2C: two-wire, addressing, master/slave, pull-ups, common uses (sensors, displays)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"SPI: four-wire, faster, chip select, common uses (displays, SD cards, some sensors)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"When to choose UART vs I2C vs SPI","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Practice","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Read sensor data and print to Serial","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Control a servo based on sensor input","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Display sensor values on OLED/LCD","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Simple multi-sensor project (e.g., temperature + distance + LED indicator)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	2	2026-08-05 19:36:45.471	2026-08-05 19:36:45.471
81c5e603-f576-414c-b712-0703aef6fae2	bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	Phase 4: Intermediate Firmware Concepts	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Move beyond Arduino abstractions toward real firmware thinking.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Interrupts: external interrupts, ISR rules (keep short, use volatile, no delay inside)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Timers and counters (PWM generation, precise timing without delay)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Non-blocking code patterns (millis() based state machines)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Reading datasheets (at least the pinout, electrical characteristics, and register summary of your MCU or a common sensor)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Basic debugging: Serial logs, multimeter checks, common failure modes (wrong pin, missing pull-up, power issues, floating inputs)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Understanding what “firmware” means vs application code","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":6},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Simple device driver style code (functions to init, read, write a sensor)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":7}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Practice","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Button interrupt that toggles LED","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Timed LED blinking without delay()","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Sensor reading using interrupts or timers where appropriate","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	3	2026-08-05 19:37:56.647	2026-08-05 19:37:56.647
078bff97-69fa-49e7-b8c2-c4062a6f1ccd	bd635aa8-5a5a-4f98-86ab-1bcc62c7d0c9	Phase 5: Integration Projects + Professional Habits	{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Goal","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":": Build complete, maintainable systems and solidify understanding.","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Projects (choose 2–3 and finish them properly)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Environmental monitor (temp/humidity + distance or light) with Serial or display output","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Simple automated system (e.g., plant watering indicator, room occupancy light, distance-based alarm)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Multi-module project combining sensors + actuator + communication","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"(Optional stretch) Add simple menu or state machine for different modes","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Professional habits","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Use Git for every project (commit messages that explain ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"why","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":")","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Write clean, modular code (separate sensor functions, clear naming)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Add comments only where the ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"why","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" is non-obvious","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Document each project briefly (what it does, how to wire it, known limitations)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":4},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Practice reading error messages and systematically debugging","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":5}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Optional advanced (if time remains)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Introduction to FreeRTOS concepts (tasks, delays, queues) on Arduino or ESP32","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Move one project to ESP32 (Wi-Fi awareness)","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":2},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Basic understanding of memory constraints and optimization","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"listitem","version":1,"value":3}],"direction":null,"format":"","indent":0,"type":"list","version":1,"listType":"bullet","start":1,"tag":"ul"}],"direction":null,"format":"","indent":0,"type":"root","version":1}}	PLANNED	4	2026-08-05 19:38:53.325	2026-08-05 19:38:53.325
\.


--
-- Data for Name: Task; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."Task" (id, "userId", title, description, notes, "dueDate", status, "completedAt", "createdAt", "updatedAt", "estimatedMinutes", "actualMinutes", "startedAt", "isPinned", "order") FROM stdin;
cmrawleg5000104lajs0ygotp	f127c8cd-f56a-4550-91b3-c42424fa186d	Add company tracker feature	User should be able to add which company they applied to, from which platform and track the status.	- Tech stack of the company \n- Hiring trends \n- News about the company	2026-07-26 12:30:00	TODO	\N	2026-07-07 17:09:01.157	2026-07-25 18:03:44.71	\N	\N	\N	f	0
cmr8u8w4r000dh7ukc1l7wgra	f127c8cd-f56a-4550-91b3-c42424fa186d	Remote/Freelance gigs hunting	Search for resources to find freelance gigs and remote jobs	- Watch some yt videos on how to start freelance	2026-07-26 12:30:00	TODO	\N	2026-07-06 06:27:45.963	2026-07-25 18:05:08.754	\N	\N	\N	f	0
cmrblwhyj000004kz9j8vg59k	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Trade PNL record all time	\N	\N	2026-07-08 04:57:00	COMPLETED	\N	2026-07-08 04:57:29.323	2026-07-08 17:14:04.235	\N	\N	\N	f	0
cmrbj6w7l000204la0k1xvecn	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Journal Review	\N	\N	2026-07-08 18:29:00	TODO	\N	2026-07-08 03:41:35.505	2026-07-08 03:41:35.505	\N	\N	\N	f	0
cmrbj2d0s000004lacz9uz18k	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Analysis	Btc analysis	\N	2026-07-08 18:29:00	COMPLETED	\N	2026-07-08 03:38:04.012	2026-07-08 04:58:04.914	\N	\N	\N	f	0
cmraybn78000004l6lovnltbs	f127c8cd-f56a-4550-91b3-c42424fa186d	Follow chai aur code CN series	Hitesh Chaudhary's Chair aur Code has started CN series, follow it.	- Put it in habit tracker as well	2026-07-07 12:30:00	COMPLETED	\N	2026-07-07 17:57:25.172	2026-07-07 18:26:52.877	\N	\N	\N	f	0
cmr91gcgo000004ju97mqa7xt	f127c8cd-f56a-4550-91b3-c42424fa186d	Reducing token consumption while using AI Agents	Find out how you can reduce your AI agent's token consumption and make it more efficient.	- Read about how an AI agent work and consumes tokens\n- Create a descriptive document or post a descriptive post about it on linkedin\n- Learn prompting techniques	2026-07-07 12:30:00	COMPLETED	\N	2026-07-06 09:49:31.032	2026-07-07 19:39:46.405	\N	\N	\N	f	0
cmrdqkdxv000004kzm7kc6nre	f127c8cd-f56a-4550-91b3-c42424fa186d	Register for google cloud arcade	Registration tarting from 13 July, register in facilitator program.	- Require a new google account\n- Ask if praveen wants to register as well	2026-07-13 12:30:00	COMPLETED	\N	2026-07-09 16:43:34.675	2026-07-13 16:49:13.076	\N	\N	\N	f	0
cmrbu4465000004l5k4ys5khj	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit: In place of suggestions add notes functionality	User should be able to add notes.	- RichText support will be better	2026-07-09 12:30:00	COMPLETED	\N	2026-07-08 08:47:21.63	2026-07-11 20:39:12.969	\N	\N	\N	f	0
cmrbnnpdm000004l8si35dhjg	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit: The dashboard page goes out of screen	Make it responsive for bigger screens	- No need to worry about mobiles, we can fix it later	2026-07-08 12:30:00	COMPLETED	\N	2026-07-08 05:46:38.266	2026-07-08 07:01:23.552	\N	\N	\N	f	0
cmrbnkt4q000004jrksf4inxe	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit: The quick add modal should close after adding/updating tasks	Currently the modal doesn't close.	\N	2026-07-08 12:30:00	COMPLETED	\N	2026-07-08 05:44:23.162	2026-07-08 07:01:33.277	\N	\N	\N	f	0
cmrb0uhq5000004jlemmcv54d	f127c8cd-f56a-4550-91b3-c42424fa186d	Fix task list on learnbit	Completed tasks should not be in the task list.	\N	2026-07-09 12:30:00	COMPLETED	\N	2026-07-07 19:08:03.773	2026-07-08 07:06:38.79	\N	\N	\N	f	0
cmrawe1c7000004lapjl4d4ud	f127c8cd-f56a-4550-91b3-c42424fa186d	Add confirmation pop-up when deleting task	A pop up should open for the user to confirm task deletion, also add pop-up for deleting habits.	\N	2026-07-08 12:30:00	COMPLETED	\N	2026-07-07 17:03:17.576	2026-07-08 07:20:58.6	\N	\N	\N	f	0
cmrb24839000004jpptrsmmbd	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit: User should be able to view habit description	Right now the user is not able to view the details of their habits.	\N	2026-07-08 12:30:00	COMPLETED	\N	2026-07-07 19:43:37.461	2026-07-08 07:40:31.369	\N	\N	\N	f	0
cmrbj9ryu000304laevunidti	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Review Diary	\N	\N	2026-07-08 18:29:00	COMPLETED	\N	2026-07-08 03:43:49.974	2026-07-08 14:31:38.821	\N	\N	\N	f	0
cmrcvdrh9000104k0py22yfx0	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Journal review	\N	\N	2026-07-09 02:10:00	TODO	\N	2026-07-09 02:10:37.533	2026-07-09 02:10:37.533	\N	\N	\N	f	0
cmrcw6okc000104jibc6aripr	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Review Diary	\N	\N	2026-07-09 02:32:00	TODO	\N	2026-07-09 02:33:06.78	2026-07-09 02:33:06.78	\N	\N	\N	f	0
cmrcw5xl1000004jiqz6uylnx	b7ff7ef1-b373-48c9-a56d-064425fbab3b	Analysis	\N	\N	2026-07-09 05:30:00	COMPLETED	\N	2026-07-09 02:32:31.813	2026-07-09 02:33:24.067	\N	\N	\N	f	0
cmr8u55tm0009h7uku2tb7j1p	f127c8cd-f56a-4550-91b3-c42424fa186d	System Design	Learn system design concepts and try to apply them	- Find out and follow a single resource, don't hop from one resource to another\n- Search for more resources and relevant things around SD on the internet	2026-07-13 12:30:00	COMPLETED	\N	2026-07-06 06:24:51.899	2026-07-11 20:39:37.504	\N	\N	\N	f	0
cmrdwklw10002a7ycw7mulkso	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit : Allow users to change task due date	Some tasks can not be completed on previously assigned dates, allow users to edit the due date of the task.	\N	2026-07-12 12:30:00	COMPLETED	\N	2026-07-09 19:31:42.673	2026-07-13 16:50:31.209	\N	\N	\N	f	0
cmrdwm6y60003a7ycivgi0tl5	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit : Module Description	We can not view module description, it should be visible in prolly a modal matching with overall theme of the application	\N	2026-07-13 12:30:00	COMPLETED	\N	2026-07-09 19:32:56.622	2026-07-13 18:01:36.401	\N	\N	\N	f	0
cmr8u14te0005h7uk13qe1c0j	f127c8cd-f56a-4550-91b3-c42424fa186d	Git essentials	Learn in-depth git concepts and advanced topics.	- Use practice websites\n- Find out tips and tricks	2026-07-13 12:30:00	COMPLETED	\N	2026-07-06 06:21:43.971	2026-07-13 18:12:53.394	\N	\N	\N	f	0
cmrcjlpkv0000p2ycddrxzkv1	f127c8cd-f56a-4550-91b3-c42424fa186d	Building react monorepo at production level	Watch the YT video in under resources in this task	\N	2026-07-26 12:30:00	TODO	\N	2026-07-08 20:40:52.928	2026-07-25 18:05:37.658	\N	\N	\N	f	0
cmrdwiwc00001a7yccuv45q8c	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit: User should be able to add module notes	When user completes a module in roadmaps, they should be able to add notes related to that module	- Implement Rich-Text Functionality	2026-07-12 12:30:00	COMPLETED	\N	2026-07-09 19:30:22.896	2026-07-13 18:01:50.05	\N	\N	\N	f	0
cmr8vhy0l000eh7ukm5j20xil	f127c8cd-f56a-4550-91b3-c42424fa186d	Explore GoLang	Learn about GoLang and how you can learn it.	- Watch some yt videos.\n- Know what its significance is.	2026-07-14 12:30:00	COMPLETED	\N	2026-07-06 07:02:47.926	2026-07-25 18:04:42.468	\N	\N	\N	f	0
cmrbmvc8c000004jvoz6n7pgz	f127c8cd-f56a-4550-91b3-c42424fa186d	Learn LLM Friendly SEO practices	Learn how we can make a website LLM/Bot Friendly	- Watch some YT videos \n- Find out some websites that are LLM/Bot friendly	2026-07-26 12:30:00	TODO	\N	2026-07-08 05:24:34.86	2026-07-25 18:03:25.536	\N	\N	\N	f	0
cmr914lfx000004jsnfs5kaz9	f127c8cd-f56a-4550-91b3-c42424fa186d	Conversation Handoffs for AI	Find out how Tally does conversation handoffs between different AI tools	- Checkout other tools similar to tally	2026-07-26 12:30:00	TODO	\N	2026-07-06 09:40:22.797	2026-07-25 18:04:02.757	\N	\N	\N	f	0
cmr8u7654000bh7uko17ul8vt	f127c8cd-f56a-4550-91b3-c42424fa186d	Design data heavy frontends	Watch youtube video on how to design data heavy frontends.	- Find some more resources and add it on learnbit	2026-07-14 12:30:00	COMPLETED	\N	2026-07-06 06:26:25.624	2026-07-25 18:41:27.539	\N	\N	\N	f	0
cmrax0aj0000004jm96b5g0py	f127c8cd-f56a-4550-91b3-c42424fa186d	Add topic tracker feature	User should be able to add their roadmaps and modules and track their progress through that roadmap.	\N	2026-07-14 12:30:00	COMPLETED	\N	2026-07-07 17:20:35.916	2026-07-09 19:37:12.891	\N	\N	\N	f	0
cmrdwnsqw0004a7ycuvncekfd	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit : Module deletion	While deleting a module from a roadmap it shows a generic alert, update it to use the central confirmation pop-up.	\N	2026-07-13 12:30:00	COMPLETED	\N	2026-07-09 19:34:11.528	2026-07-13 18:01:28.341	\N	\N	\N	f	0
cmrhsj429000104l5uprki7n5	f127c8cd-f56a-4550-91b3-c42424fa186d	Revise Networking from notes.	I am following a CN series that has to be revised.	- Use the notes section in the application to jot down some notes while revision.	2026-07-13 12:30:00	COMPLETED	\N	2026-07-12 12:49:39.153	2026-07-13 18:22:52.171	\N	\N	\N	f	0
cmrkk9z46000004l1ul4g4m7f	f127c8cd-f56a-4550-91b3-c42424fa186d	Complete arcade badge	One lab has been completed, complete other labs to get 1 Point	- Email : chaurasiaprince065@gmail.com	2026-07-26 12:30:00	TODO	\N	2026-07-14 11:21:54.438	2026-07-25 18:03:06.199	\N	\N	\N	f	0
cmseyb198000104l29eu899h7	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit updates	In habit tracker page - there is a horizontal scroll, fix it. \nIn dashboar - tasks having no date should appear in daily tasks	\N	\N	COMPLETED	\N	2026-08-04 17:47:43.772	2026-08-04 19:02:42.988	\N	\N	\N	f	0
cmrgu0bnf000104jxej0sznze	f127c8cd-f56a-4550-91b3-c42424fa186d	Backend from first principles	Learn backend concepts from the playlist, link provided.	\N	\N	TODO	\N	2026-07-11 20:43:15.579	2026-08-04 19:04:52.044	\N	\N	\N	f	0
cmsfrdoyz000004jweul4yik8	bae0143b-febc-4b92-8ece-7ba323963550	Prince is a good boy	\N	\N	\N	COMPLETED	\N	2026-08-05 07:21:36.683	2026-08-05 07:23:02.083	\N	\N	\N	f	0
cmsey7sfy000004l2hm0r2r3t	f127c8cd-f56a-4550-91b3-c42424fa186d	Youtube thumbnail design	How to design youtube thumbnail and use it in top quality.	\N	\N	COMPLETED	\N	2026-08-04 17:45:12.382	2026-08-05 18:43:13.346	\N	\N	\N	f	0
cmsgi0xwz000004l5t5huz8ms	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit Update : Roadmap module	While creating a new roadmap or adding a module in a roadmap, the modal closes without any confirmation of whether something was created or not. Add loading states to show that it is being created. Close the modal only when the module/roadmap is created.	\N	\N	TODO	\N	2026-08-05 19:47:31.379	2026-08-05 19:47:31.379	\N	\N	\N	f	0
cmsgi2342000004jsy1z0ojnt	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit Update: Task Element	Clicking on a task element in dashboard gives error. Fix it.	\N	\N	TODO	\N	2026-08-05 19:48:24.77	2026-08-05 19:48:24.77	\N	\N	\N	f	0
cmsgizqzd000004jpvtrosyil	f127c8cd-f56a-4550-91b3-c42424fa186d	Learnbit Feature : Dayplanner feature	Implement a feature for users to plan their day and tick mark what they have done.	\N	\N	TODO	\N	2026-08-05 20:14:35.354	2026-08-05 20:14:35.354	\N	\N	\N	f	0
\.


--
-- Data for Name: TaskResource; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."TaskResource" (id, "taskId", url, title, "createdAt") FROM stdin;
cmrazdjoj000004jvb6lg3i9f	cmraybn78000004l6lovnltbs	https://youtu.be/CltcZTyF5nM	\N	2026-07-07 18:26:52.877
cmrgtvnw1000004jxc8p37pcw	cmr8u55tm0009h7uku2tb7j1p	https://youtube.com/playlist?list=PLRtLu6rCuAlkO-HiER3AKoKkSG5DPp9TX&si=luxg_jGhXw_S9Cnu	\N	2026-07-11 20:39:37.504
cmrjgj27z000004jmmtfp0gbp	cmrdqkdxv000004kzm7kc6nre	https://arcadepoints.vercel.app/facilitator-program	\N	2026-07-13 16:49:13.076
cmrjjinjg00016byc1mf8ujns	cmr8u14te0005h7uk13qe1c0j	https://ohmygit.org/	\N	2026-07-13 18:12:53.394
cmrjjinjg00026byc5o5m02kz	cmr8u14te0005h7uk13qe1c0j	https://game4git.games/	\N	2026-07-13 18:12:53.394
cmrjjinjg00036byckvu5y6nt	cmr8u14te0005h7uk13qe1c0j	https://www.makeuseof.com/git-learn-interactive-resources/	\N	2026-07-13 18:12:53.394
cms0ogau6000004jobuf8aj5a	cmrkk9z46000004l1ul4g4m7f	https://www.skills.google/games/7317?utm_source=googleskills&utm_medium=lp&utm_campaign=specgame-july-arcade26	\N	2026-07-25 18:03:06.199
cms0ohihi000104jopqkui06b	cmr914lfx000004jsnfs5kaz9	http://tally-kohl-pi.vercel.app/	\N	2026-07-25 18:04:02.757
cms0ojjoe000304joel3fm75u	cmrcjlpkv0000p2ycddrxzkv1	https://youtu.be/2Z39k2-EaN0	\N	2026-07-25 18:05:37.658
cms0ptmk4000004lapbsqt2f5	cmr8u7654000bh7uko17ul8vt	https://youtu.be/nw-7ry_hhio	\N	2026-07-25 18:41:27.539
cmsf128yl000004jxjb4meik3	cmrgu0bnf000104jxej0sznze	https://youtube.com/playlist?list=PLui3EUkuMTPgZcV0QhQrOcwMPcBCcd_Q1&si=Pa2R14Gv5cmBTAKm	\N	2026-08-04 19:04:52.044
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9795ac1a-31d8-481f-b59f-a744fac99c37	69c497fa43145b145ac53b4bc564b9a7ba2c9906e07c4fd0561e6b34279d4953	2026-07-06 04:32:05.506484+00	20260706043204_add_revision_model	\N	\N	2026-07-06 04:32:05.074025+00	1
4ab3bc13-ff35-4dba-9384-f8d53e2e3177	697a067bd6f35c7afd69846d6498597bf6a8a61bc363f833b86b65c2cee21388	2026-07-07 14:06:38.112757+00	20260707140636_add_habit_tracker	\N	\N	2026-07-07 14:06:37.188395+00	1
f6c17014-a880-44e8-b552-03b9564216aa	3628ef13cae2ae0e092ce103c6b784680ab6004d6c1be13e9790f6aa7164ef78	2026-07-08 19:35:43.270291+00	20260708193542_init_roadmaps	\N	\N	2026-07-08 19:35:42.656067+00	1
e377b7bc-19ab-444f-9b51-35c8e8622502	1f7c0c9d6f2332a0488cd28e4609bd138d85c17e30a90c7f3b63c8cdecb8ce19	2026-07-11 19:45:23.10649+00	20260711194522_init_notes_folders	\N	\N	2026-07-11 19:45:22.860574+00	1
631b98aa-395f-43ed-9269-da9c8dee0810	f870fc1bbd33be1b0161e4d6fe794cb108371d155617145ee6ad3d43d474f170	2026-07-25 16:04:39.864859+00	20260725160439_habit_skip_weekends	\N	\N	2026-07-25 16:04:39.741184+00	1
\.


--
-- Name: Folder Folder_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_pkey" PRIMARY KEY (id);


--
-- Name: HabitLog HabitLog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HabitLog"
    ADD CONSTRAINT "HabitLog_pkey" PRIMARY KEY (id);


--
-- Name: Habit Habit_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Habit"
    ADD CONSTRAINT "Habit_pkey" PRIMARY KEY (id);


--
-- Name: Note Note_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_pkey" PRIMARY KEY (id);


--
-- Name: Revision Revision_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Revision"
    ADD CONSTRAINT "Revision_pkey" PRIMARY KEY (id);


--
-- Name: RoadmapModule RoadmapModule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RoadmapModule"
    ADD CONSTRAINT "RoadmapModule_pkey" PRIMARY KEY (id);


--
-- Name: Roadmap Roadmap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Roadmap"
    ADD CONSTRAINT "Roadmap_pkey" PRIMARY KEY (id);


--
-- Name: TaskResource TaskResource_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaskResource"
    ADD CONSTRAINT "TaskResource_pkey" PRIMARY KEY (id);


--
-- Name: Task Task_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Task"
    ADD CONSTRAINT "Task_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: HabitLog_habitId_date_key; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "HabitLog_habitId_date_key" ON public."HabitLog" USING btree ("habitId", date);


--
-- Name: HabitLog_habitId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "HabitLog_habitId_idx" ON public."HabitLog" USING btree ("habitId");


--
-- Name: Revision_taskId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Revision_taskId_idx" ON public."Revision" USING btree ("taskId");


--
-- Name: Revision_userId_scheduledAt_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Revision_userId_scheduledAt_idx" ON public."Revision" USING btree ("userId", "scheduledAt");


--
-- Name: Revision_userId_status_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Revision_userId_status_idx" ON public."Revision" USING btree ("userId", status);


--
-- Name: RoadmapModule_roadmapId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "RoadmapModule_roadmapId_idx" ON public."RoadmapModule" USING btree ("roadmapId");


--
-- Name: Roadmap_userId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "Roadmap_userId_idx" ON public."Roadmap" USING btree ("userId");


--
-- Name: TaskResource_taskId_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "TaskResource_taskId_idx" ON public."TaskResource" USING btree ("taskId");


--
-- Name: Folder Folder_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Folder"
    ADD CONSTRAINT "Folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: HabitLog HabitLog_habitId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."HabitLog"
    ADD CONSTRAINT "HabitLog_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES public."Habit"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Note Note_folderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Note"
    ADD CONSTRAINT "Note_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES public."Folder"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Revision Revision_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Revision"
    ADD CONSTRAINT "Revision_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: RoadmapModule RoadmapModule_roadmapId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."RoadmapModule"
    ADD CONSTRAINT "RoadmapModule_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES public."Roadmap"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: TaskResource TaskResource_taskId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TaskResource"
    ADD CONSTRAINT "TaskResource_taskId_fkey" FOREIGN KEY ("taskId") REFERENCES public."Task"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: -
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- Name: FUNCTION pg_replication_origin_advance(text, pg_lsn); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_advance(text, pg_lsn) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_create(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_create(text) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_drop(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_drop(text) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_oid(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_oid(text) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_progress(text, boolean); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_progress(text, boolean) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_session_is_setup(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_is_setup() TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_session_progress(boolean); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_progress(boolean) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_session_reset(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_reset() TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_session_setup(text); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_session_setup(text) TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_xact_reset(); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_reset() TO pg_create_subscription;


--
-- Name: FUNCTION pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_replication_origin_xact_setup(pg_lsn, timestamp with time zone) TO pg_create_subscription;


--
-- Name: FUNCTION pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn); Type: ACL; Schema: pg_catalog; Owner: -
--

GRANT ALL ON FUNCTION pg_catalog.pg_show_replication_origin_status(OUT local_id oid, OUT external_id text, OUT remote_lsn pg_lsn, OUT local_lsn pg_lsn) TO pg_create_subscription;


--
-- PostgreSQL database dump complete
--

\unrestrict MBSXw668c6J5wCJJ297ZB3sirrBoehzP6uL9LKhsgMaBz9dLubhfydTxMRlei6O

