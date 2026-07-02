--
-- PostgreSQL database dump
--

\restrict nEUIGEhqFSXnCCcPWQOgYL2lB2JopIO6gOVBQS8ICAiRO5HBAGOkxTeW5nVuLZk

-- Dumped from database version 18.4
-- Dumped by pg_dump version 18.4

-- Started on 2026-07-02 09:33:41

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

--
-- TOC entry 865 (class 1247 OID 16389)
-- Name: booking_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.booking_status AS ENUM (
    'pending',
    'accepted',
    'rejected',
    'completed'
);


ALTER TYPE public.booking_status OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 16412)
-- Name: bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bookings (
    id integer NOT NULL,
    user_id integer,
    fullname character varying(255) NOT NULL,
    room character varying(50) NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL,
    status public.booking_status DEFAULT 'pending'::public.booking_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.bookings OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16411)
-- Name: bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookings_id_seq OWNER TO postgres;

--
-- TOC entry 5093 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bookings_id_seq OWNED BY public.bookings.id;


--
-- TOC entry 228 (class 1259 OID 16572)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id integer NOT NULL,
    upload_id integer NOT NULL,
    name character varying(100) NOT NULL,
    comment text NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16571)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 5094 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 230 (class 1259 OID 16592)
-- Name: contact_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_messages (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    email character varying(150) NOT NULL,
    subject character varying(200) NOT NULL,
    message text NOT NULL,
    date_sent timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    status character varying(20) DEFAULT 'Unread'::character varying
);


ALTER TABLE public.contact_messages OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16591)
-- Name: contact_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_messages_id_seq OWNER TO postgres;

--
-- TOC entry 5095 (class 0 OID 0)
-- Dependencies: 229
-- Name: contact_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_messages_id_seq OWNED BY public.contact_messages.id;


--
-- TOC entry 232 (class 1259 OID 16608)
-- Name: evaluations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.evaluations (
    evaluation_id integer NOT NULL,
    name character varying(100) DEFAULT NULL::character varying,
    role character varying(50) NOT NULL,
    child_cleanliness smallint NOT NULL,
    child_safety smallint NOT NULL,
    child_toys smallint NOT NULL,
    child_comfort smallint NOT NULL,
    child_supervision smallint NOT NULL,
    lact_privacy smallint NOT NULL,
    lact_clean smallint NOT NULL,
    lact_comfort smallint NOT NULL,
    lact_access smallint NOT NULL,
    lact_equipment smallint NOT NULL,
    gender_respect smallint NOT NULL,
    gender_equality smallint NOT NULL,
    gender_worklife smallint NOT NULL,
    gender_discrimination smallint NOT NULL,
    impact_stress smallint NOT NULL,
    impact_needs smallint NOT NULL,
    suggestions text,
    date_submitted timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.evaluations OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16607)
-- Name: evaluations_evaluation_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.evaluations_evaluation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.evaluations_evaluation_id_seq OWNER TO postgres;

--
-- TOC entry 5096 (class 0 OID 0)
-- Dependencies: 231
-- Name: evaluations_evaluation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.evaluations_evaluation_id_seq OWNED BY public.evaluations.evaluation_id;


--
-- TOC entry 226 (class 1259 OID 16554)
-- Name: uploads; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uploads (
    id integer NOT NULL,
    title character varying(255) NOT NULL,
    description text NOT NULL,
    category character varying(100) NOT NULL,
    progress integer NOT NULL,
    filename character varying(255) NOT NULL,
    file_path character varying(255) NOT NULL,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.uploads OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16553)
-- Name: uploads_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.uploads_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.uploads_id_seq OWNER TO postgres;

--
-- TOC entry 5097 (class 0 OID 0)
-- Dependencies: 225
-- Name: uploads_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.uploads_id_seq OWNED BY public.uploads.id;


--
-- TOC entry 224 (class 1259 OID 16536)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16535)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5098 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 220 (class 1259 OID 16398)
-- Name: users_login; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users_login (
    id integer NOT NULL,
    fullname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users_login OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16397)
-- Name: users_login_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_login_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_login_id_seq OWNER TO postgres;

--
-- TOC entry 5099 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_login_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_login_id_seq OWNED BY public.users_login.id;


--
-- TOC entry 4891 (class 2604 OID 16415)
-- Name: bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings ALTER COLUMN id SET DEFAULT nextval('public.bookings_id_seq'::regclass);


--
-- TOC entry 4899 (class 2604 OID 16575)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 4901 (class 2604 OID 16595)
-- Name: contact_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages ALTER COLUMN id SET DEFAULT nextval('public.contact_messages_id_seq'::regclass);


--
-- TOC entry 4904 (class 2604 OID 16611)
-- Name: evaluations evaluation_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluations ALTER COLUMN evaluation_id SET DEFAULT nextval('public.evaluations_evaluation_id_seq'::regclass);


--
-- TOC entry 4897 (class 2604 OID 16557)
-- Name: uploads id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads ALTER COLUMN id SET DEFAULT nextval('public.uploads_id_seq'::regclass);


--
-- TOC entry 4894 (class 2604 OID 16539)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 4889 (class 2604 OID 16401)
-- Name: users_login id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login ALTER COLUMN id SET DEFAULT nextval('public.users_login_id_seq'::regclass);


--
-- TOC entry 5077 (class 0 OID 16412)
-- Dependencies: 222
-- Data for Name: bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bookings (id, user_id, fullname, room, date, start_time, end_time, status, created_at) FROM stdin;
2	1	Juan Dela Cruz	Room 2	2026-07-01	13:17:00	13:57:00	pending	2026-07-01 13:15:49.740062
3	2	JUAN TAMAD	Room 1	2026-07-01	14:16:00	14:56:00	completed	2026-07-01 14:15:17.020246
\.


--
-- TOC entry 5083 (class 0 OID 16572)
-- Dependencies: 228
-- Data for Name: comments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comments (id, upload_id, name, comment, created_at) FROM stdin;
\.


--
-- TOC entry 5085 (class 0 OID 16592)
-- Dependencies: 230
-- Data for Name: contact_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_messages (id, name, email, subject, message, date_sent, status) FROM stdin;
\.


--
-- TOC entry 5087 (class 0 OID 16608)
-- Dependencies: 232
-- Data for Name: evaluations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.evaluations (evaluation_id, name, role, child_cleanliness, child_safety, child_toys, child_comfort, child_supervision, lact_privacy, lact_clean, lact_comfort, lact_access, lact_equipment, gender_respect, gender_equality, gender_worklife, gender_discrimination, impact_stress, impact_needs, suggestions, date_submitted) FROM stdin;
\.


--
-- TOC entry 5081 (class 0 OID 16554)
-- Dependencies: 226
-- Data for Name: uploads; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.uploads (id, title, description, category, progress, filename, file_path, uploaded_at) FROM stdin;
\.


--
-- TOC entry 5079 (class 0 OID 16536)
-- Dependencies: 224
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, password, role, created_at) FROM stdin;
1	admin	$2y$10$fW3x64s0HnqtZ8Vlnh/CtOkI..6PWohiemq8joKgacGxSHAJUjlDW	admin	2026-07-01 15:17:16.574776+08
\.


--
-- TOC entry 5075 (class 0 OID 16398)
-- Dependencies: 220
-- Data for Name: users_login; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users_login (id, fullname, email, password, created_at) FROM stdin;
1	Juan Dela Cruz	test@1234	$2b$10$CvutwMHDa3a7JmY08KzVT.L2gWhQ9JNYDlqSmIe56QmF..QlKHidW	2026-07-01 10:41:23.083986
2	JUAN TAMAD	test@12345	$2b$10$fD.1U/ifO3/cczExYWlE1ueuVtqCaaUtnV7pq0eTrGAj7gE1Uc0o.	2026-07-01 13:53:24.584131
\.


--
-- TOC entry 5100 (class 0 OID 0)
-- Dependencies: 221
-- Name: bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bookings_id_seq', 3, true);


--
-- TOC entry 5101 (class 0 OID 0)
-- Dependencies: 227
-- Name: comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comments_id_seq', 1, false);


--
-- TOC entry 5102 (class 0 OID 0)
-- Dependencies: 229
-- Name: contact_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_messages_id_seq', 1, false);


--
-- TOC entry 5103 (class 0 OID 0)
-- Dependencies: 231
-- Name: evaluations_evaluation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.evaluations_evaluation_id_seq', 1, false);


--
-- TOC entry 5104 (class 0 OID 0)
-- Dependencies: 225
-- Name: uploads_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.uploads_id_seq', 1, true);


--
-- TOC entry 5105 (class 0 OID 0)
-- Dependencies: 223
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- TOC entry 5106 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_login_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_login_id_seq', 2, true);


--
-- TOC entry 4912 (class 2606 OID 16425)
-- Name: bookings bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_pkey PRIMARY KEY (id);


--
-- TOC entry 4920 (class 2606 OID 16585)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 4922 (class 2606 OID 16606)
-- Name: contact_messages contact_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_messages
    ADD CONSTRAINT contact_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 4924 (class 2606 OID 16636)
-- Name: evaluations evaluations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.evaluations
    ADD CONSTRAINT evaluations_pkey PRIMARY KEY (evaluation_id);


--
-- TOC entry 4918 (class 2606 OID 16570)
-- Name: uploads uploads_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uploads
    ADD CONSTRAINT uploads_pkey PRIMARY KEY (id);


--
-- TOC entry 4908 (class 2606 OID 16410)
-- Name: users_login users_login_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT users_login_email_key UNIQUE (email);


--
-- TOC entry 4910 (class 2606 OID 16408)
-- Name: users_login users_login_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users_login
    ADD CONSTRAINT users_login_pkey PRIMARY KEY (id);


--
-- TOC entry 4914 (class 2606 OID 16550)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4916 (class 2606 OID 16552)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4925 (class 2606 OID 16426)
-- Name: bookings bookings_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bookings
    ADD CONSTRAINT bookings_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users_login(id) ON DELETE CASCADE;


--
-- TOC entry 4926 (class 2606 OID 16586)
-- Name: comments comments_upload_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES public.uploads(id) ON DELETE CASCADE;


-- Completed on 2026-07-02 09:33:41

--
-- PostgreSQL database dump complete
--

\unrestrict nEUIGEhqFSXnCCcPWQOgYL2lB2JopIO6gOVBQS8ICAiRO5HBAGOkxTeW5nVuLZk

