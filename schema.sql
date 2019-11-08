--
-- PostgreSQL database dump
--

-- Dumped from database version 11.3 (Ubuntu 11.3-1.pgdg14.04+1)
-- Dumped by pg_dump version 11.3 (Ubuntu 11.3-1.pgdg14.04+1)

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
-- Name: cube; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: angular_similarity(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.angular_similarity(x public.cube, y public.cube) RETURNS real
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare pi real := 3.14159265359;
	declare cos_sim real;
BEGIN
	select cosine_similarity(x, y) into cos_sim;
	if cos_sim > 1 then
		cos_sim := 1;
	end if;
	if cos_sim < -1 THEN
		cos_sim := -1;
	end if;
	return 1 - (acos(cos_sim) / pi);
END;
$$;


ALTER FUNCTION public.angular_similarity(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: cosine_similarity(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cosine_similarity(x public.cube, y public.cube) RETURNS real
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare origin cube := cube(array[0,0,0]);
	declare mag_x real;
	declare mag_y real;
	declare sim real;
	declare epsilon real := 0.00000000000001;
BEGIN
	select (origin <-> x) + epsilon into mag_x;
	select (origin <-> y) + epsilon into mag_y;
	sim := (dot_product(x, y) / (mag_x * mag_y));
	return sim;
END;
$$;


ALTER FUNCTION public.cosine_similarity(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: cube_add(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_add(x public.cube, y public.cube) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	a = cube_ll_coord(x,1) + cube_ll_coord(y,1);
	b = cube_ll_coord(x,2) + cube_ll_coord(y,2);
	c = cube_ll_coord(x,3) + cube_ll_coord(y,3);
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_add(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: cube_divide(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_divide(x public.cube, y public.cube) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	a = cube_ll_coord(x,1) / cube_ll_coord(y,1);
	b = cube_ll_coord(x,2) / cube_ll_coord(y,2);
	c = cube_ll_coord(x,3) / cube_ll_coord(y,3);
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_divide(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: cube_multiply(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_multiply(x public.cube, y public.cube) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	a = cube_ll_coord(x,1) * cube_ll_coord(y,1);
	b = cube_ll_coord(x,2) * cube_ll_coord(y,2);
	c = cube_ll_coord(x,3) * cube_ll_coord(y,3);
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_multiply(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: cube_pop_mean1(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_mean1() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select avg(cube_ll_coord(feature1, 1)) from features into a;
	select avg(cube_ll_coord(feature1, 2)) from features into b;
	select avg(cube_ll_coord(feature1, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_mean1() OWNER TO postgres;

--
-- Name: cube_pop_mean2(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_mean2() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select avg(cube_ll_coord(feature2, 1)) from features into a;
	select avg(cube_ll_coord(feature2, 2)) from features into b;
	select avg(cube_ll_coord(feature2, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_mean2() OWNER TO postgres;

--
-- Name: cube_pop_mean3(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_mean3() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select avg(cube_ll_coord(feature3, 1)) from features into a;
	select avg(cube_ll_coord(feature3, 2)) from features into b;
	select avg(cube_ll_coord(feature3, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_mean3() OWNER TO postgres;

--
-- Name: cube_pop_std1(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_std1() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select STDDEV_POP(cube_ll_coord(feature1, 1)) from features into a;
	select STDDEV_POP(cube_ll_coord(feature1, 2)) from features into b;
	select STDDEV_POP(cube_ll_coord(feature1, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_std1() OWNER TO postgres;

--
-- Name: cube_pop_std2(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_std2() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select STDDEV_POP(cube_ll_coord(feature2, 1)) from features into a;
	select STDDEV_POP(cube_ll_coord(feature2, 2)) from features into b;
	select STDDEV_POP(cube_ll_coord(feature2, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_std2() OWNER TO postgres;

--
-- Name: cube_pop_std3(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_pop_std3() RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	select STDDEV_POP(cube_ll_coord(feature3, 1)) from features into a;
	select STDDEV_POP(cube_ll_coord(feature3, 2)) from features into b;
	select STDDEV_POP(cube_ll_coord(feature3, 3)) from features into c;
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_pop_std3() OWNER TO postgres;

--
-- Name: cube_subtract(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.cube_subtract(x public.cube, y public.cube) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare a real;
	declare b real;
	declare c real;
BEGIN
	a = cube_ll_coord(x,1) - cube_ll_coord(y,1);
	b = cube_ll_coord(x,2) - cube_ll_coord(y,2);
	c = cube_ll_coord(x,3) - cube_ll_coord(y,3);
	return cube(array[a,b,c]);
END;
$$;


ALTER FUNCTION public.cube_subtract(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: dot_product(public.cube, public.cube); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.dot_product(x public.cube, y public.cube) RETURNS real
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare product real := 0.0;
	declare dimension real;
BEGIN
	select cube_dim(x) into dimension;
	for i in 1..dimension loop 
		product := product + (cube_ll_coord(x, i) * cube_ll_coord(y, i));
	end loop;
	return product;
END;
$$;


ALTER FUNCTION public.dot_product(x public.cube, y public.cube) OWNER TO postgres;

--
-- Name: feature1_normalized(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.feature1_normalized(_id integer) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare feature cube;
BEGIN
	select f.feature1 from features f where f.id = _id into feature;
	return cube_divide(cube_subtract(feature, cube_pop_mean1()), cube_pop_std1());
END;
$$;


ALTER FUNCTION public.feature1_normalized(_id integer) OWNER TO postgres;

--
-- Name: feature2_normalized(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.feature2_normalized(_id integer) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare feature cube;
BEGIN
	select f.feature2 from features f where f.id = _id into feature;
	return cube_divide(cube_subtract(feature, cube_pop_mean2()), cube_pop_std2());
END;
$$;


ALTER FUNCTION public.feature2_normalized(_id integer) OWNER TO postgres;

--
-- Name: feature3_normalized(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.feature3_normalized(_id integer) RETURNS public.cube
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
	declare feature cube;
BEGIN
	select f.feature3 from features f where f.id = _id into feature;
	return cube_divide(cube_subtract(feature, cube_pop_mean3()), cube_pop_std3());
END;
$$;


ALTER FUNCTION public.feature3_normalized(_id integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: artists; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artists (
    id integer NOT NULL,
    name character varying DEFAULT ''::character varying,
    website character varying DEFAULT ''::character varying,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.artists OWNER TO postgres;

--
-- Name: artists_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.artists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artists_id_seq OWNER TO postgres;

--
-- Name: artists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.artists_id_seq OWNED BY public.artists.id;


--
-- Name: features; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.features (
    id integer NOT NULL,
    track_id integer,
    feature1 public.cube,
    feature2 public.cube,
    feature3 public.cube,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.features OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.features_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.features_id_seq OWNER TO postgres;

--
-- Name: features_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.features_id_seq OWNED BY public.features.id;


--
-- Name: metros; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.metros (
    id integer NOT NULL,
    name character varying DEFAULT ''::character varying,
    coordinates point,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.metros OWNER TO postgres;

--
-- Name: metros_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.metros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.metros_id_seq OWNER TO postgres;

--
-- Name: metros_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.metros_id_seq OWNED BY public.metros.id;


--
-- Name: shows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shows (
    id integer NOT NULL,
    artist_id integer,
    venue_id integer,
    date date,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.shows OWNER TO postgres;

--
-- Name: shows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shows_id_seq OWNER TO postgres;

--
-- Name: shows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.shows_id_seq OWNED BY public.shows.id;


--
-- Name: tracks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tracks (
    id integer NOT NULL,
    artist_id integer,
    title character varying DEFAULT ''::character varying,
    url character varying DEFAULT ''::character varying,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.tracks OWNER TO postgres;

--
-- Name: track_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.track_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.track_id_seq OWNER TO postgres;

--
-- Name: track_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.track_id_seq OWNED BY public.tracks.id;


--
-- Name: venues; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.venues (
    id integer NOT NULL,
    name character varying DEFAULT ''::character varying,
    coordinates point,
    metro_id integer,
    created timestamp without time zone DEFAULT now()
);


ALTER TABLE public.venues OWNER TO postgres;

--
-- Name: venue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.venue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.venue_id_seq OWNER TO postgres;

--
-- Name: venue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.venue_id_seq OWNED BY public.venues.id;


--
-- Name: artists id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists ALTER COLUMN id SET DEFAULT nextval('public.artists_id_seq'::regclass);


--
-- Name: features id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features ALTER COLUMN id SET DEFAULT nextval('public.features_id_seq'::regclass);


--
-- Name: metros id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metros ALTER COLUMN id SET DEFAULT nextval('public.metros_id_seq'::regclass);


--
-- Name: shows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows ALTER COLUMN id SET DEFAULT nextval('public.shows_id_seq'::regclass);


--
-- Name: tracks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks ALTER COLUMN id SET DEFAULT nextval('public.track_id_seq'::regclass);


--
-- Name: venues id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venues ALTER COLUMN id SET DEFAULT nextval('public.venue_id_seq'::regclass);


--
-- Name: artists artists_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artists
    ADD CONSTRAINT artists_pkey PRIMARY KEY (id);


--
-- Name: features features_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_pkey PRIMARY KEY (id);


--
-- Name: metros metros_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.metros
    ADD CONSTRAINT metros_pkey PRIMARY KEY (id);


--
-- Name: shows shows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_pkey PRIMARY KEY (id);


--
-- Name: tracks track_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT track_pkey PRIMARY KEY (id);


--
-- Name: venues venue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venue_pkey PRIMARY KEY (id);


--
-- Name: artists_unique_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX artists_unique_name ON public.artists USING btree (name);


--
-- Name: features_feature2_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX features_feature2_index ON public.features USING gist (feature2);


--
-- Name: features_feature3_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX features_feature3_index ON public.features USING gist (feature3);


--
-- Name: features_feature_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX features_feature_index ON public.features USING gist (feature1);


--
-- Name: features_unique_track_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX features_unique_track_id ON public.features USING btree (track_id);


--
-- Name: metros_unique_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX metros_unique_name ON public.metros USING btree (name);


--
-- Name: shows_unique_artist_venue; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX shows_unique_artist_venue ON public.shows USING btree (artist_id, venue_id, date);


--
-- Name: track_unique_title_band_pair; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX track_unique_title_band_pair ON public.tracks USING btree (title, artist_id);


--
-- Name: track_unique_url; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX track_unique_url ON public.tracks USING btree (url);


--
-- Name: venue_unique_name_metro; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX venue_unique_name_metro ON public.venues USING btree (name, metro_id);


--
-- Name: features features_track_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.features
    ADD CONSTRAINT features_track_id_fkey FOREIGN KEY (track_id) REFERENCES public.tracks(id) ON DELETE CASCADE;


--
-- Name: shows shows_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON DELETE CASCADE;


--
-- Name: shows shows_venue_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shows
    ADD CONSTRAINT shows_venue_id_fkey FOREIGN KEY (venue_id) REFERENCES public.venues(id) ON DELETE CASCADE;


--
-- Name: tracks track_artist_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tracks
    ADD CONSTRAINT track_artist_id_fkey FOREIGN KEY (artist_id) REFERENCES public.artists(id) ON DELETE CASCADE;


--
-- Name: venues venue_metro_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.venues
    ADD CONSTRAINT venue_metro_id_fkey FOREIGN KEY (metro_id) REFERENCES public.metros(id) ON DELETE CASCADE;


--
-- Name: TABLE artists; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.artists TO client;


--
-- Name: SEQUENCE artists_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.artists_id_seq TO client;


--
-- Name: TABLE features; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.features TO client;


--
-- Name: SEQUENCE features_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.features_id_seq TO client;


--
-- Name: TABLE metros; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.metros TO client;


--
-- Name: SEQUENCE metros_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.metros_id_seq TO client;


--
-- Name: TABLE shows; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.shows TO client;


--
-- Name: SEQUENCE shows_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.shows_id_seq TO client;


--
-- Name: TABLE tracks; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.tracks TO client;


--
-- Name: SEQUENCE track_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.track_id_seq TO client;


--
-- Name: TABLE venues; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.venues TO client;


--
-- Name: SEQUENCE venue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.venue_id_seq TO client;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: client
--

ALTER DEFAULT PRIVILEGES FOR ROLE client IN SCHEMA public REVOKE ALL ON TABLES  FROM client;
ALTER DEFAULT PRIVILEGES FOR ROLE client IN SCHEMA public GRANT SELECT,INSERT,DELETE,UPDATE ON TABLES  TO client;


--
-- PostgreSQL database dump complete
--

