-- LilMed: blood collection photo pack (run once in the SQL editor)
-- Images live in /public/blood-collection. Two requested needles have no confirmed photo.
BEGIN;

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Paediatric Tube 0.5ml — Clot Activator (Red) 50/Tray', '5636105', 'IMPROMINI capillary blood collection tube, clot activator, 0.5ml, red cap. Reference 5636105, tray of 50.', 'Paediatric Tubes 0.5ml', '50/tray', 0, '/blood-collection/tubes/Red_Clot_Activator_Tubes.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Paediatric Tube 0.5ml — Clot Activator (Red) 50/Tray');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Paediatric Tube 0.5ml — Gel & Clot Activator 50/Tray', '5636205', 'IMPROMINI capillary blood collection tube, gel and clot activator, 0.5ml. Reference 5636205, tray of 50.', 'Paediatric Tubes 0.5ml', '50/tray', 0, '/blood-collection/tubes/Orange_Top_Gel_and_Clot_Activator_Tubes.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Paediatric Tube 0.5ml — Gel & Clot Activator 50/Tray');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Paediatric Tube 0.5ml — Lithium Heparin (Green) 50/Tray', '5636505', 'IMPROMINI capillary blood collection tube, lithium heparin, 0.5ml, green cap. Reference 5636505, tray of 50.', 'Paediatric Tubes 0.5ml', '50/tray', 0, '/blood-collection/tubes/Green_Top_Collection_Tubes.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Paediatric Tube 0.5ml — Lithium Heparin (Green) 50/Tray');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Paediatric Tube 0.5ml — EDTA K2 50/Tray', '5636805', 'IMPROMINI capillary blood collection tube, EDTA K2, 0.5ml, lavender cap. Reference 5636805, tray of 50.', 'Paediatric Tubes 0.5ml', '50/tray', 0, '/blood-collection/tubes/EDTA_K2_Purple_Tubes.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Paediatric Tube 0.5ml — EDTA K2 50/Tray');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Paediatric Tube 0.5ml — EDTA K2 Plus 100/Tray', '5656806', 'IMPROMINI capillary blood collection tube, EDTA K2 Plus, 0.5ml. Reference 5656806, tray of 100.', 'Paediatric Tubes 0.5ml', '100/tray', 0, '/blood-collection/tubes/EDTA_K2_Plus_Tubes.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Paediatric Tube 0.5ml — EDTA K2 Plus 100/Tray');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'VAC 4ml K2EDTA Lavender BX 100', 'BC-T01', 'Vacu Lab K2EDTA vacuum blood collection tube, lavender cap, 4ml, box of 100.', 'Blood Collection Tubes', '100/box', 0, '/blood-collection/tubes/VAC_4mL_K2EDTA_Lavender_Box_100.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'VAC 4ml K2EDTA Lavender BX 100');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'VAC 4.5ml Sodium Citrate 3.2% Blue BX 100', 'BC-T02', 'Vacu Lab coagulation tube, sodium citrate 3.2%, blue cap, 4.5ml, box of 100.', 'Blood Collection Tubes', '100/box', 0, '/blood-collection/tubes/VAC_4.5mL_Sodium_Citrate_Blue_3.2_Percent_Box_100.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'VAC 4.5ml Sodium Citrate 3.2% Blue BX 100');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'VAC 5ml SST Gold Serum Gel BX 100', 'BC-T03', 'Vacu Lab SST serum gel tube, gold cap, 5ml, box of 100.', 'Blood Collection Tubes', '100/box', 0, '/blood-collection/tubes/VAC_5mL_SST_Gold_Serum_Gel_Box_100.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'VAC 5ml SST Gold Serum Gel BX 100');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT '21G GREEN NEEDLE BX 100 (21G x 1.5 INCH / 0.8 x 40MM)', 'NED1HPD05', 'LYSA hypodermic needle, 21G x 1.5 inch (0.8 x 40mm), green box, product code NED1HPD05, 100 per box.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Hypodermic_Needles_Green_Box_21G_Visible_Label.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = '21G GREEN NEEDLE BX 100 (21G x 1.5 INCH / 0.8 x 40MM)');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'HYPODERMIC NEEDLE 25G X 0.625 INCH 100/Box', 'BC-N02', 'SURGI PLUS hypodermic needle, 25G x 5/8 inch (0.625 inch, 0.5 x 16mm), Luer lock, 100 per box.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Hypodermic_Needles_Yellow_Box_25G_Label.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'HYPODERMIC NEEDLE 25G X 0.625 INCH 100/Box');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'NEEDLE HYPODERMIC 20G X 1 INCH 100/Box', 'BC-N03', 'duraSurge disposable hypodermic needle, 20G x 1 inch, 100 per box.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Hypodermic_Needles_20G_x_1in_Label.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'NEEDLE HYPODERMIC 20G X 1 INCH 100/Box');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'NEEDLE HYPODERMIC 22G X 1.25 INCH (0.70 X 32MM) 100/Box', 'NED1HPD06', 'LYSA hypodermic needle, 22G x 1.25 inch (0.7 x 32mm), product code NED1HPD06, 100 per box.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Hypodermic_Needles_22G_Shown_With_Box.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'NEEDLE HYPODERMIC 22G X 1.25 INCH (0.70 X 32MM) 100/Box');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Medi Star Hypodermic Needle 22Gx32mm Black', 'BC-N05', 'Medi Star Hypodermic Needle, 22Gx32mm Black. Non-toxic, non-pyrogenic. Sterile EO. CE 0197. ISO13485: 2016.', 'Blood Collection Needles', '1 box', 0, '/blood-collection/needles/Hypodermic_Needles_White_Box_22Gx32mm.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE sap = 'BC-N05' OR name = 'Medi Star Hypodermic Needle 22Gx32mm Black');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Eclipse Safety Needle 21G/1.25 BOX/48', 'BC-N06', 'Vacu Lab Safety Blood Collection Set. Blood collection needles for single use. Sterile EO. Non-pyrogenic. CE 0123.', 'Blood Collection Needles', '48/box', 0, '/blood-collection/needles/Vacu_Lab_Safety_Blood_Collection_Needles.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Eclipse Safety Needle 21G/1.25 BOX/48');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'NEEDLE HYPODERMIC 18G X 1.5 INCH (1.2 X 40MM) 100/Box', 'NED1HPD02', 'LYSA hypodermic needle, 18G x 1.5 inch (1.2 x 40mm), product code NED1HPD02, 100 per box.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Hypodermic_Needles_Pink_Box_18G_Label.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'NEEDLE HYPODERMIC 18G X 1.5 INCH (1.2 X 40MM) 100/Box');

INSERT INTO public.products (name, sap, description, raw_category, inner_moq, price, image_url, category_id)
SELECT 'Disposable Sterile Venous Blood Specimen Collection Needle 100pcs', 'BC-N09', 'Sterile venous blood specimen collection needle, 100 per box. Gauge and length are not printed on the face of the carton.', 'Blood Collection Needles', '100/box', 0, '/blood-collection/needles/Sterile_Blood_Collection_Needles_Blue_Box.jpg', id
FROM public.categories WHERE slug = 'blood-collection-tubes-needles'
AND NOT EXISTS (SELECT 1 FROM public.products WHERE name = 'Disposable Sterile Venous Blood Specimen Collection Needle 100pcs');

COMMIT;
