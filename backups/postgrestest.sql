PGDMP                         {           postgres    15.4    15.4                0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                       0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false                       1262    5    postgres    DATABASE     �   CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = icu LOCALE = 'en_US.UTF-8' ICU_LOCALE = 'en-US';
    DROP DATABASE postgres;
                postgres    false                       0    0    DATABASE postgres    COMMENT     N   COMMENT ON DATABASE postgres IS 'default administrative connection database';
                   postgres    false    3613            �            1259    16408    movie    TABLE     �   CREATE TABLE public.movie (
    id integer NOT NULL,
    title character varying(200) NOT NULL,
    still_url character varying(500) NOT NULL,
    last_shown timestamp without time zone
);
    DROP TABLE public.movie;
       public         heap    postgres    false            �            1259    16407    movie_id_seq    SEQUENCE     �   CREATE SEQUENCE public.movie_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.movie_id_seq;
       public          postgres    false    215                       0    0    movie_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.movie_id_seq OWNED BY public.movie.id;
          public          postgres    false    214            �           2604    16411    movie id    DEFAULT     d   ALTER TABLE ONLY public.movie ALTER COLUMN id SET DEFAULT nextval('public.movie_id_seq'::regclass);
 7   ALTER TABLE public.movie ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215                      0    16408    movie 
   TABLE DATA           A   COPY public.movie (id, title, still_url, last_shown) FROM stdin;
    public          postgres    false    215   j                   0    0    movie_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.movie_id_seq', 226, true);
          public          postgres    false    214            �           2606    16415    movie movie_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.movie
    ADD CONSTRAINT movie_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.movie DROP CONSTRAINT movie_pkey;
       public            postgres    false    215                  x��\�r�6�^SO�]6�B���v��r$GWҌk������E=$�J�mfy�c^��]V\ƨ��ʉ�R���f�im�~۝����4ˢ�J�t�nV�?ֵ��4��;^��'�4a	�	KBS����u���G��T*�D�d��ߚ]��|!� i�y~�m,����I���(t���>�4ͺ��}398�pb�� '4W�F��
$��uUm�o��~J��#�$	���*����4~��<�W�����
˦��Ƙg˟�Ʃg�����: T)��+�<!= a�f���\xB~�,��������'�� T3B0��?��	`��<Z6Fow�p��%&�C�4�-����
���A�H��-R11Ki�Ӿ/�m�&>/�e[.����U��]k����t�=�6d %�!#)���/3��G�b���$����b_� �@�� �v��2�	'�~�1Idj���Y�,j�(RYz!I�dR&�F��=ld�*�e��G,.�r�T�	�"~g6lm�`>��M��M>��#ک�ܚ���Gg�^�ͮi����@i-
-�뒇�ɓ�J1�R����!�5}�X�p�ӈ�"!"��ف�g�i�.t|ZU�0�" #b�5zl̺,���z��؅����P2")Q��7h3��C '~���ǆllܬ�YD����Z � �WB'��A�wmY����}U�/��T|�PA�W�+ߘ=hҷ3:q0�0Oɀ�וY�l��*j���	���Cx�\�ѫM���<l�r����)�Ι𩜐���>w*z�?|�ra��j��"�^���}|�0�>~��,�h �tz��F�^�7ୋ6��W�"�C��T��$K��f@�,���B
Ы�遅9�ɣs�Ar�~~
*�V�@��,�d+�\AR�$����V� 9�}|�B�q,`���ɀ#�$�yJ	��E�����-C��
?�fO��O��~�]_�M|ݚ�� (�l$�lo2%i�Nj+���z[�$�_��Kp@[�ڽ�խ4z]�~��@�\��"�$tR��E�wU^
�N�N/BX�Jj����
�^6��d�_J���bB�"�7���R;��\�g��*���H����t}|n�'ִ?�=��ݭ�w�Hk�HEVfm�Q�Q����1�D�QI����j�W�ְءqu'��=�]���>' �IH�.�g��)��X�W��5:���bI�GB��đ@&��1��$9����Dd'���<�8�ܦ����&��O�P'�8��R�,�}�Y���_;�㳲ȗ<� D�/Dғ����Md
vxD��O�i��$��L��eG,{��L�_���ّH�$)1��>G�)�!o���%�i�h[��)�nMe���o� �@
[ʠ�@@�����q&���H&N���H)N��\��(K�7Ƭ���w3A��'���8�o�d�P�|�n2n9m�_��p�X �c�M>��i���i²�"E��2�ՠ[�N����d���+�O���d����ȶ�}|g�E�g� Ro�B6�~�*�:�X���ݛ	�+F���$�6H%���:��7���^@$e�j*�T濦�ٔ�*]�P�:~�_�v�c|��ة����_�]B	�=��&K�D;�@t�~����$)���jJ�Uk��{��E�5@��������+��	Nʎ4�V
/=��R�-�4�h\��:�7m|iB������44������?U��r��A��r`�&9��a���	�Y۾i��#�5�$��X��W��P�n�W�s��rU�P��%��m@c�t����L� p�c^^a���Ԡ�P�2�G䕳�oy9������;��~w�c6T�C'p_6e����	葏0�0�&����c�k����2���|0ADF ���d��{�~�����M������!gݶ�'�1�ٶd����3�f���+:49���1ad=�?���~Wŗ!Ex9�SMGbq
e"���H!�H�}|����օ��\�N�o�@\U:����J�|۠r��E�E�*6L mH}��qpr�ɳ��h�V/e@��@ā������D�[�w~`n9�I�w�����7_!�h |D��W.��Ԏd��R�̳�7�(��h�x�DYd�K-�� |��C盥��{b~8bE��:*�K�?M@�����i����f�F4=$s>���������̩= ���0.۽nͽ����*�Kw�38�$�2�D���������Bc5��qc���)�*2
>�U�ݙ���#��퉅���͢Kc�!�e?��)2�ljV6�]����ay�M����`���)��g"�Z%��f$��%�+vM2�,����1UH>S��+
�ь0;�����U�.�ʝ4l����iU�"�,�	א��Ajp��l���F��,l�~�kW!�UXL�k�u
�$��S��^R���P���b�����^�g�D���[,�'O=�\��(˟ۗ��| 9��	��i�e��B�芯C������z���#���6�_?G���J�Dɯo�$MA�ytU��~�u����!Y�
�;�yJ`B\tm�O��S��������{���Taѭ!.`<s�������3��5�3*�揄�0��G8�	I�i�y���A��_q�����"�X�M���,ȶMJDc�u;�2>�Ţ�&~evM��m���j�@��4�,޶M��B��H25{oeݕuߙ�<dh��!�#w� �̒#!�taV{�\�z�c�##򳾇����	81��.NQ��T(��"}>��s�Td�c�Z���u���ؙ�Ͼ�9�f�������e]�H��ǉ�g��F�Rq�-t@A�u8���5� �"ʍ
�,�.!�ؔ�;"�Z#ytm���'l��'� ꅜzoG>!�F+�~k�<�Hg��F׻j�.�a��P�ޡ\����ɬS ��r3:���5�D�]�xX�E$D@��W_H��v�G7F�p�hWe�� �!��u-S������4���	�l[w4�1�H��敲gQI���<��-��-x�� EkD:
�l��R�5v�_�]@߫� P�Gm�60IU��r*�ۥn�uHC���)�/H:�r�it[|
	�~�H����Q�R��#��s�~�M
"S Ogۥ���&��u��$A�����Ci~�|փ͒�p:M9it�����!�q�ԵS�.�e��OC`�n{���*����[�Q4��G�I�IS<��q�)Ëm�<������6g�����Ӂ�>�2�`,� Õ�O��,=%���˲�P
����v��$ŏ�5�Ä�݄�oy`�b�,fyt���-wX�U*j���t_��@�q�ŌE�+��F�b�d����9�2����y �`8F��O��x6%���̋(�(�rUďe����ȸ㷺ٲ��4���1�4i���|6��Ԋ=���J�qVj�]��妃_�EQ���z'��П*�(���
Wy_�ݽc�aWe>W��Y,�:�>D�Y:�'Q[��;o��4��{�p�k "HD�kF"�["׮�t֛ȝQ�1���)s+k��O�����ќ�޷�s��o�~�ٔE�C�١�C2���o�{���HG�Ȇ��]�es7������Y V�ܷ�o}��m��ϋ�'~p,�3hHɐ��
w�i&��{G�;3�,벷M�W��ې��p�t���gQ0w�seo����	�B%f&�;�� O�7C_��O��9�E"�;6D'6���hN�y,ڱ�|n&%т-zl/��<q�t���:�����$8��9;�-}y_��
yD����@�)w5l}��C�X I�����y/�=�$�	��?�\"��� ~R�%��`T=X̽���AW���Uه|7��+d������%"5]%���S��n7����<�
�g!�跲Gx��u0(O}C�%� 0�'�����D���*���|X6A��N�a6�aNT��M���L�C����!����|� '  �D$��Y�Qg��fY�
j��1��+�X(9,v��>��F��~��}wY+�{���Geg�����\&�S�d��1���z<I��ֈ[ �
12>��	+Z`�d��� G(�FeT����۩�� �-� �n/3ڜ�x�
ߜ1�{��6!!ѐUY��-�N�L��_�dl�"f=|�^A2b6�~���7,�[S�+έ�`1�I|�.����&22��sw�u⚗m�����)���/E�yH"fO-#W��7e�AWZЬlb,�>����zz]F�,��OVP�6��v��]ïqP��O�Y\�Pq��K�"�f46 �7yr�e����J������ًϖ���N�ѡ�ˬ�K��M��8�ɸ������_����kgK㠛4wK{�w�F�U҈r'_�Ů?�8D&-���-�}��� � �X��)��B8<S���4H$�xt��nS�������ې����9�I���)=J��M��.��	Rg"��U)\BX�^,I�ӧ�˦�Qqz��㣣��;��P     