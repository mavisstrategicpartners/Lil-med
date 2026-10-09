-- LilMed: new vial / bottle ranges (run once in the SQL editor)
BEGIN;

INSERT INTO public.categories (name, slug) VALUES ('Autosampler Vials & Headspace Vials', 'autosampler-headspace-vials') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.categories (name, slug) VALUES ('EPA VOA & TOC Vials', 'epa-voa-toc-vials') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.categories (name, slug) VALUES ('Culture Tubes', 'culture-tubes') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.categories (name, slug) VALUES ('Micro Vials & Inserts', 'micro-vial-inserts') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;
INSERT INTO public.categories (name, slug) VALUES ('Reagent Bottles', 'reagent-bottles') ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '9mm 2ml Short Thread HPLC Autosampler Vial', 'A001', '9mm short-thread 2ml borosilicate autosampler vial with write-in patch, for Agilent and other robotic samplers.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-9mm-2ml-short-thread-hplc-autosampler-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '9mm 2ml Short Thread HPLC Autosampler Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '9mm Short Thread Caps with Septa', 'A002', 'Polypropylene 9mm screw caps with PTFE/silicone septa, open centre hole or closed top.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-9mm-short-thread-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '9mm Short Thread Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '8-425 2ml Screw Neck HPLC Autosampler Vial', 'A003', '8-425 screw neck 2ml chromatography vial in clear or amber borosilicate glass.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-8-425-2ml-screw-neck-hplc-autosampler-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '8-425 2ml Screw Neck HPLC Autosampler Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Screw Caps with Septa for 8-425 Screw Neck Vial', 'A004', 'Knurled polypropylene 8-425 screw caps pre-assembled with PTFE/silicone septa.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-screw-caps-with-septa-8-425.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Screw Caps with Septa for 8-425 Screw Neck Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '10-425 Screw Neck 2ml HPLC Autosampler Vial', 'A005', 'Wide-mouth 10-425 screw neck 2ml vial, ideal for needle-wash and high-throughput analysis.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-10-425-screw-neck-2ml-hplc-autosampler-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '10-425 Screw Neck 2ml HPLC Autosampler Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '10-425 Screw Caps with Septa', 'A006', 'Polypropylene 10-425 hole caps with excellent chemical resistance; septa bonded or separate.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-10-425-screw-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '10-425 Screw Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '11mm Crimp Top 2ml Autosampler Vial', 'A007', '11mm crimp-top 2ml chromatography vial for the most secure, tamper-evident seal.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-11mm-crimp-top-2ml-autosampler-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '11mm Crimp Top 2ml Autosampler Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '11mm Crimp Top Caps with Septa', 'A008', '11mm aluminium crimp caps with PTFE/silicone septa for long-term sample security.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-11mm-crimp-top-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '11mm Crimp Top Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '11mm Snap Ring 2ml Autosampler Vial', 'A009', '11mm snap-ring 2ml vial — universal fit for most autosamplers, no crimping tool required.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-11mm-snap-ring-2ml-autosampler-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '11mm Snap Ring 2ml Autosampler Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '11mm Snap Top Caps with Septa', 'A010', 'Polyethylene 11mm snap caps with PTFE/silicone septa — fast, tool-free sealing.', 'HPLC & GC Autosampler Vials', '1 pack', 0, '/vials/vial-11mm-snap-top-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '11mm Snap Top Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20mm Crimp Top Magnetic Aluminium Caps with Septa', 'A011', 'Magnetic 20mm crimp caps with PTFE/silicone or PTFE/butyl septa for headspace autosamplers.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20mm-crimp-top-aluminum-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20mm Crimp Top Magnetic Aluminium Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '18mm Screw Headspace Vial', 'A012', '18mm precision screw-neck headspace vial, 10ml and 20ml, high temperature resistant.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-18mm-screw-headspace-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '18mm Screw Headspace Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20ml Headspace Vials', 'A013', '20ml headspace vial available in screw or crimp neck, flat or round bottom.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20ml-headspace-vials.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20ml Headspace Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Butyl Rubber Stopper for 20mm Crimp Vials', 'A014', 'Flat butyl rubber stopper with high chemical stability and ageing resistance.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-butyl-rubber-stopper-20mm-crimp-vials.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Butyl Rubber Stopper for 20mm Crimp Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20mm Crimp Top Aluminium Caps', 'A015', 'Silver aluminium 20mm crimp caps for sealing headspace vials.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20mm-crimp-top-aluminum-caps.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20mm Crimp Top Aluminium Caps');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20mm 20ml Crimp Headspace Vial', 'A016', '20ml crimp-neck headspace vial, flat or round bottom, clear or amber.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20mm-20ml-crimp-headspace-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20mm 20ml Crimp Headspace Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '18mm 20ml Screw Headspace Vial', 'A017', '20ml precision screw-neck headspace vial for magnetic metal caps.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-18mm-20ml-screw-headspace-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '18mm 20ml Screw Headspace Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20mm 10ml Crimp Top Headspace Vial', 'A018', '10ml crimp-top headspace vial in clear or amber borosilicate glass.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20mm-10ml-crimp-top-headspace-vial.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20mm 10ml Crimp Top Headspace Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '18mm 10ml Screw Headspace Vials', 'A019', '10ml precision screw headspace vial with magnetic metal cap compatibility.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-18mm-10ml-screw-headspace-vials.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '18mm 10ml Screw Headspace Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '20mm 6ml Crimp Top Headspace Vials (Karl Fischer)', 'A020', '6ml crimp-top vial for Karl Fischer moisture determination and small-volume headspace work.', 'Headspace Vials & Caps', '1 pack', 0, '/vials/hs-20mm-6ml-crimp-top-headspace-vials-karl-fischer.webp', id
FROM public.categories WHERE slug = 'autosampler-headspace-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '20mm 6ml Crimp Top Headspace Vials (Karl Fischer)');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '15-425 Screw Sample Storage Vial', 'A021', '8ml and 12ml borosilicate sample storage vial with 15-425 screw neck.', 'EPA & TOC Vials', '1 pack', 0, '/vials/epa-15-425-screw-sample-storage-vial.webp', id
FROM public.categories WHERE slug = 'epa-voa-toc-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '15-425 Screw Sample Storage Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '15-425 Thread Caps with Septa', 'A022', 'PP 15-425 caps with PTFE/silicone septa, 9mm centre hole or closed top.', 'EPA & TOC Vials', '1 pack', 0, '/vials/epa-15-425-thread-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'epa-voa-toc-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '15-425 Thread Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '40ml TOC Vial', 'A023', '40ml TOC / purge-and-trap vial with 24-400 screw neck, clear or amber.', 'EPA & TOC Vials', '1 pack', 0, '/vials/epa-40ml-toc-vial.webp', id
FROM public.categories WHERE slug = 'epa-voa-toc-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '40ml TOC Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'EPA VOA Vials', 'A024', '20–60ml EPA VOA storage vials for volatile organic analysis.', 'EPA & TOC Vials', '1 pack', 0, '/vials/epa-voa-vials.webp', id
FROM public.categories WHERE slug = 'epa-voa-toc-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'EPA VOA Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '24-400 Screw Neck PP Caps with Septa', 'A025', 'PP 24-400 caps with 22 x 3mm PTFE/silicone septa and 15mm centre hole.', 'EPA & TOC Vials', '1 pack', 0, '/vials/epa-24-400-screw-neck-pp-caps-with-septa.webp', id
FROM public.categories WHERE slug = 'epa-voa-toc-vials'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '24-400 Screw Neck PP Caps with Septa');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Glass Sample Cell with Cap, 25mm', 'A026', '20ml and 30ml clear borosilicate sample cell with black closed-top screw cap.', 'Culture & Test Tubes', '1 pack', 0, '/vials/ct-glass-sample-cell-with-cap-25mm.webp', id
FROM public.categories WHERE slug = 'culture-tubes'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Glass Sample Cell with Cap, 25mm');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '16mm COD Digestion Test Tube', 'A027', 'High borosilicate 16mm COD digestion tube for laboratory and chemical plant COD testing.', 'Culture & Test Tubes', '1 pack', 0, '/vials/ct-16mm-cod-digestion-test-tube.webp', id
FROM public.categories WHERE slug = 'culture-tubes'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '16mm COD Digestion Test Tube');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Glass Test Tube with Screw Cap, 13mm & 16mm', 'A028', '8–15ml round-bottom borosilicate culture tube with black closed-top screw cap.', 'Culture & Test Tubes', '1 pack', 0, '/vials/ct-glass-test-tube-with-screw-cap-13mm-16mm.webp', id
FROM public.categories WHERE slug = 'culture-tubes'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Glass Test Tube with Screw Cap, 13mm & 16mm');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '0.3ml 11mm Glass Crimp Vial with Fused Insert', 'A029', '0.3ml crimp-neck micro vial with fused-in insert — no separate insert to place.', 'Micro Vials', '1 pack', 0, '/vials/mv-0-3ml-11mm-glass-crimp-vial-fused-insert.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '0.3ml 11mm Glass Crimp Vial with Fused Insert');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '9mm 0.3ml Glass Micro Vial with Integrated Insert', 'A030', '0.3ml screw-neck micro vial with integrated insert for limited sample volumes.', 'Micro Vials', '1 pack', 0, '/vials/mv-9mm-0-3ml-glass-micro-vial-integrated-insert.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '9mm 0.3ml Glass Micro Vial with Integrated Insert');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Micro Inserts for HPLC Vials', 'A031', '150 / 250 / 300µl clear glass inserts for 1.5–2ml HPLC vials, flat or conical.', 'Vial Inserts', '1 pack', 0, '/vials/mv-micro-inserts-for-hplc-vials.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Micro Inserts for HPLC Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '1ml Shell Vial', 'A032', '1ml clear borosilicate shell vial with PE plug and flat bottom.', 'Micro Vials', '1 pack', 0, '/vials/mv-1ml-shell-vial.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '1ml Shell Vial');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '300µl Micro Insert, Flat Bottom (100/pk)', 'A033', 'Type I300 flat-bottom 300µl glass insert for 9, 10 and 11mm vials.', 'Vial Inserts', '100 / pack', 0, '/vials/mv-300ul-micro-insert-flat-bottom.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '300µl Micro Insert, Flat Bottom (100/pk)');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '250µl Conical Bottom Vial Insert, 9/10/11mm (100/pk)', 'A034', 'Type IV250 conical-bottom insert for maximum sample recovery.', 'Vial Inserts', '100 / pack', 0, '/vials/mv-250ul-conical-bottom-vial-insert.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '250µl Conical Bottom Vial Insert, 9/10/11mm (100/pk)');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '250µl Vial Insert, Glass with Spring Bottom (9/10/11mm)', 'A035', 'Type IP250 insert with polymer feet that centre and cushion the insert in the vial.', 'Vial Inserts', '1 pack', 0, '/vials/mv-250ul-vial-insert-glass-spring-bottom.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '250µl Vial Insert, Glass with Spring Bottom (9/10/11mm)');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '250µl Micro Insert, Flat Bottom for 8-425 Vials', 'A036', 'Type I250 flat-bottom insert sized for 8-425 HPLC vials.', 'Vial Inserts', '1 pack', 0, '/vials/mv-250ul-micro-insert-flat-bottom-8-425.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '250µl Micro Insert, Flat Bottom for 8-425 Vials');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '150µl 8mm Conical Bottom Vial Insert', 'A037', 'Type IV150 conical insert for 8-425 screw vials and trace-level samples.', 'Vial Inserts', '1 pack', 0, '/vials/mv-150ul-8mm-conical-bottom-vial-insert.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '150µl 8mm Conical Bottom Vial Insert');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '150µl Vial Insert, Glass with Polymer Feet (8-425)', 'A038', 'Type IP150 insert with polymer feet for 8-425 screw-top vials.', 'Vial Inserts', '1 pack', 0, '/vials/mv-150ul-glass-polymer-feet-8-425.webp', id
FROM public.categories WHERE slug = 'micro-vial-inserts'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '150µl Vial Insert, Glass with Polymer Feet (8-425)');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Amber Reagent Bottle for Laboratory', 'A039', 'Borosilicate 3.3 amber reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-amber-reagent-bottle-laboratory.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Amber Reagent Bottle for Laboratory');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Clear Reagent Bottle for Laboratory', 'A040', 'Borosilicate 3.3 clear reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-clear-reagent-bottle-laboratory.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Clear Reagent Bottle for Laboratory');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'GL45 Reagent Bottle 100ml', 'A041', 'Borosilicate 3.3 clear and amber reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-gl45-reagent-bottle-100ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'GL45 Reagent Bottle 100ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'GL45 Reagent Bottle 250ml', 'A042', 'Borosilicate 3.3 clear and amber reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-gl45-reagent-bottle-250ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'GL45 Reagent Bottle 250ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'GL45 Reagent Bottle 500ml', 'A043', 'Borosilicate 3.3 clear and amber reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-gl45-reagent-bottle-500ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'GL45 Reagent Bottle 500ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'GL45 Reagent Bottle 1000ml', 'A044', 'Borosilicate 3.3 clear and amber reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-gl45-reagent-bottle-1000ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'GL45 Reagent Bottle 1000ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Clear Reagent Bottle 100ml', 'A045', 'Borosilicate 3.3 clear reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-clear-reagent-bottle-100ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Clear Reagent Bottle 100ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Clear Reagent Bottle 250ml', 'A046', 'Borosilicate 3.3 clear reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-clear-reagent-bottle-250ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Clear Reagent Bottle 250ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Clear Reagent Bottle 500ml', 'A047', 'Borosilicate 3.3 clear reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-clear-reagent-bottle-500ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Clear Reagent Bottle 500ml');
INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Clear Reagent Bottle 1000ml', 'A048', 'Borosilicate 3.3 clear reagent bottle with GL45 cap, pouring ring and enamel graduations.', 'GL45 Reagent Bottles', '1 pack', 0, '/vials/rb-clear-reagent-bottle-1000ml.webp', id
FROM public.categories WHERE slug = 'reagent-bottles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Clear Reagent Bottle 1000ml');

COMMIT;