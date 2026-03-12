(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))t(o);new MutationObserver(o=>{for(const e of o)if(e.type==="childList")for(const n of e.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function r(o){const e={};return o.integrity&&(e.integrity=o.integrity),o.referrerPolicy&&(e.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?e.credentials="include":o.crossOrigin==="anonymous"?e.credentials="omit":e.credentials="same-origin",e}function t(o){if(o.ep)return;o.ep=!0;const e=r(o);fetch(o.href,e)}})();const u=[{id:1,referencia:"690681",tipo:"garaje",titulo:"Garaje en Hórreo",municipio:"Santiago de Compostela",barrio:"Hórreo",precio:70,unidad_precio:"mes",superficie_construida:10,superficie_extra:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/horreo/3086/16022362/es/",descripcion:"Plaza de garaje en el barrio del Hórreo. Acceso cómodo y seguro.",imagen:null},{id:2,referencia:"755169",tipo:"garaje",titulo:"Garaje en Ensanche",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:null,unidad_precio:"mes",superficie_construida:23,superficie_extra:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:38500,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/ensanche/3086/755169/es/",descripcion:"Plaza de garaje de 23 m² en el Ensanche. Disponible también en venta.",imagen:null},{id:3,referencia:"753074",tipo:"estudio",titulo:"Estudio junto al Campus Norte",municipio:"Santiago de Compostela",barrio:"Campus Norte - S. Caetano",precio:475,unidad_precio:"mes",superficie_construida:30,superficie_extra:null,habitaciones:1,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/studio/santiago-de-compostela/campus-norte-s-caetano/3086/25799314/es/",descripcion:"Estudio de 30 m² ideal para estudiantes o trabajadores del Campus Norte.",imagen:null},{id:4,referencia:"630486",tipo:"piso",titulo:"Piso todo exterior en Dormea",municipio:"Boimorto",barrio:"Dormea",precio:300,unidad_precio:"mes",superficie_construida:100,superficie_extra:15,habitaciones:2,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!0,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/boimorto/dormea/3086/10637693/es/",descripcion:"Amplio piso de 100 m² con 15 m² adicionales, todas las habitaciones exteriores. Entorno rural tranquilo.",imagen:null},{id:5,referencia:"350534",tipo:"piso",titulo:"Piso en Villagarcía de Arousa",municipio:"Vilanova de Arousa",barrio:"Villagarcía de Arousa",precio:600,unidad_precio:"mes",superficie_construida:65,superficie_extra:10,habitaciones:2,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/vilanova-de-arousa/villagarcia-de-arousa/3086/2688528/es/",descripcion:"Piso de 65 m² con 10 m² adicionales y 2 dormitorios en Villagarcía de Arousa.",imagen:null},{id:6,referencia:"692743",tipo:"piso",titulo:"Piso todo exterior en Vite",municipio:"Santiago de Compostela",barrio:"Vite",precio:650,unidad_precio:"mes",superficie_construida:89,superficie_extra:6,habitaciones:3,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!0,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/vite/3086/16268254/es/",descripcion:"Piso de 89 m² totalmente exterior en el barrio de Vite con 3 dormitorios. Luminoso y bien comunicado.",imagen:null},{id:7,referencia:"535147",tipo:"piso",titulo:"Piso en Galeras",municipio:"Santiago de Compostela",barrio:"Galeras",precio:700,unidad_precio:"mes",superficie_construida:70,superficie_extra:null,habitaciones:2,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/galeras/3086/6801301/es/",descripcion:"Piso de 70 m² en el barrio de Galeras, zona universitaria con excelente acceso al centro histórico.",imagen:null},{id:8,referencia:"360497",tipo:"piso",titulo:"Piso con ascensor y terraza en Ensanche",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:950,unidad_precio:"mes",superficie_construida:100,superficie_extra:25,habitaciones:4,banos:2,ascensor:!0,terraza:!0,amueblado:!1,exterior:!1,estado:"reservado",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/ensanche/3086/2698467/es/",descripcion:"Magnifico piso de 100 m² con 25 m² de terraza, 4 dormitorios y 2 baños en el Ensanche. Con ascensor.",imagen:null},{id:9,referencia:"755170",tipo:"piso",titulo:"Piso todo exterior — Campus Norte",municipio:"Santiago de Compostela",barrio:"Campus Norte - S. Caetano",precio:1e3,unidad_precio:"mes",superficie_construida:75,superficie_extra:null,habitaciones:3,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!0,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/campus-norte-s-caetano/3086/26369791/es/",descripcion:"Luminoso piso de 75 m² con todas las habitaciones al exterior. Ideal para familias o profesionales del Campus Norte.",imagen:null},{id:10,referencia:"759624",tipo:"piso",titulo:"Piso en el Ensanche",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:1100,unidad_precio:"mes",superficie_construida:107,superficie_extra:null,habitaciones:3,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/ensanche/3086/759624/es/",descripcion:"Piso de 107 m² en el Ensanche con 3 dormitorios y 2 baños. Zona céntrica y bien comunicada.",imagen:null},{id:11,referencia:"533008",tipo:"oficina",titulo:"Oficina en Hórreo — con opción a compra",municipio:"Santiago de Compostela",barrio:"Hórreo",precio:400,unidad_precio:"mes",superficie_construida:35,superficie_extra:null,habitaciones:0,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"opcion_compra",precio_compra:75e3,descuento_compra:-23,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/office/santiago-de-compostela/horreo/3086/6712190/es/",descripcion:"Oficina de 35 m² en el Hórreo. Disponible también con opción a compra. Precio anterior compra: 58.000 €.",imagen:null},{id:12,referencia:"741977",tipo:"oficina",titulo:"Oficina en Meixonfrio",municipio:"Santiago de Compostela",barrio:"Meixonfrio",precio:700,unidad_precio:"mes",superficie_construida:160,superficie_extra:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/office/santiago-de-compostela/meixonfrio/3086/22228421/es/",descripcion:"Amplia oficina de 160 m² con 2 baños en Meixonfrio. Espacios diáfanos, ideal para equipo mediano.",imagen:null},{id:13,referencia:"758422",tipo:"oficina",titulo:"Oficina representativa en Hórreo — 4 despachos",municipio:"Santiago de Compostela",barrio:"Hórreo",precio:1900,unidad_precio:"mes",superficie_construida:149,superficie_extra:null,habitaciones:4,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/office/santiago-de-compostela/horreo/3086/758422/es/",descripcion:"Oficina de 149 m² con 4 despachos independientes en la calle del Hórreo. Ideal para despacho profesional o consultoría.",imagen:null},{id:14,referencia:"315673",tipo:"local",titulo:"Local comercial en Pontepedriña — todo exterior",municipio:"Santiago de Compostela",barrio:"Pontepedriña",precio:550,unidad_precio:"mes",superficie_construida:100,superficie_extra:null,habitaciones:0,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!0,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/santiago-de-compostela/pontepedrina/3086/2653667/es/",descripcion:"Local comercial de 100 m² totalmente exterior en Pontepedriña. Ideal para negocio, taller o uso comercial.",imagen:null},{id:15,referencia:"489276",tipo:"local",titulo:"Local comercial en el Hórreo",municipio:"Santiago de Compostela",barrio:"Hórreo",precio:800,unidad_precio:"mes",superficie_construida:130,superficie_extra:null,habitaciones:0,banos:1,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/santiago-de-compostela/horreo/3086/4784430/es/",descripcion:"Local de 130 m² en la céntrica calle del Hórreo. Alto tráfico peatonal, perfecto para comercio o clínica.",imagen:null},{id:16,referencia:"750487",tipo:"local",titulo:"Bajo comercial en Ensanche",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:1500,unidad_precio:"mes",superficie_construida:210,superficie_extra:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/ensanche/3086/750487/es/",descripcion:"Gran bajo comercial de 210 m² en el Ensanche. Perfecto para restaurante, academia o gran superficie.",imagen:null},{id:17,referencia:"744234",tipo:"local",titulo:"Local comercial en Milladoiro",municipio:"Ames",barrio:"Milladoiro O",precio:2e3,unidad_precio:"mes",superficie_construida:235,superficie_extra:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/ames/milladoiro-o/3086/744234/es/",descripcion:"Gran local de 235 m² en Milladoiro (Ames). Alta visibilidad y tráfico comercial junto a Santiago. Ideal para franquicia o showroom.",imagen:null},{id:18,referencia:"737642",tipo:"nave",titulo:"Nave industrial en Sionlla",municipio:"Santiago de Compostela",barrio:"Sionlla",precio:2500,unidad_precio:"mes",superficie_construida:1426,superficie_extra:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"disponible",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/industrial-unit/santiago-de-compostela/sionlla/3086/737642/es/",descripcion:"Gran nave industrial de 1.426 m² en el polígono de Sionlla. Acceso para transporte pesado. Ideal para logística o almacén.",imagen:null},{id:19,referencia:"759624_b",tipo:"piso",titulo:"Piso en Santiago — pendiente confirmar",municipio:"Santiago de Compostela",barrio:null,precio:null,unidad_precio:"mes",superficie_construida:null,superficie_extra:null,habitaciones:null,banos:null,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"pendiente",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/alquiler.php",descripcion:"Propiedad de la página 2 del catálogo. Datos pendientes de confirmar en CRM Inmovilla.",imagen:null},{id:20,referencia:"pendiente_20",tipo:"piso",titulo:"Piso en Santiago — pendiente confirmar",municipio:"Santiago de Compostela",barrio:null,precio:null,unidad_precio:"mes",superficie_construida:null,superficie_extra:null,habitaciones:null,banos:null,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"pendiente",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/alquiler.php",descripcion:"Propiedad de la página 2 del catálogo. Datos pendientes de confirmar en CRM Inmovilla.",imagen:null},{id:21,referencia:"pendiente_21",tipo:"piso",titulo:"Piso en Santiago — pendiente confirmar",municipio:"Santiago de Compostela",barrio:null,precio:null,unidad_precio:"mes",superficie_construida:null,superficie_extra:null,habitaciones:null,banos:null,ascensor:!1,terraza:!1,amueblado:!1,exterior:!1,estado:"pendiente",precio_compra:null,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/alquiler.php",descripcion:"Propiedad de la página 2 del catálogo. Datos pendientes de confirmar en CRM Inmovilla.",imagen:null}],y=()=>u.filter(a=>a.estado==="disponible");u.length,y().length,u.filter(a=>a.estado==="reservado").length,Math.min(...u.filter(a=>a.precio).map(a=>a.precio)),Math.max(...u.filter(a=>a.precio).map(a=>a.precio)),[...new Set(u.map(a=>a.tipo))],[...new Set(u.map(a=>a.municipio))];const p=[{id:1,referencia:"700219",tipo:"terreno",subtipo:"parcela",titulo:"Parcela en Zona Vedra",municipio:"Vedra",barrio:"Zona Vedra",precio:1e4,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:4770,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/plot-of-land/vedra/zona-vedra/3086/16939638/es/",descripcion:"Parcela de 4.770 m² en Zona Vedra. Amplio terreno a precio muy competitivo.",imagen:null},{id:2,referencia:"700220",tipo:"terreno",subtipo:"parcela",titulo:"Parcela en Boqueixón - Vedra",municipio:"Vedra",barrio:"Boqueixón - Vedra",precio:15e3,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:11236,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/plot-of-land/vedra/boqueixon-vedra/3086/16939796/es/",descripcion:"Gran parcela de 11.236 m² en Boqueixón - Vedra. Precio inmejorable para terreno de esta superficie.",imagen:null},{id:3,referencia:"732491",tipo:"terreno",subtipo:"rustico",titulo:"Terreno Rústico en Arins",municipio:"Santiago de Compostela",barrio:"Arins",precio:16e3,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:5820,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/rural-land/santiago-de-compostela/arins/3086/20491125/es/",descripcion:"Terreno rústico de 5.820 m² en Arins, cerca de Santiago de Compostela.",imagen:null},{id:4,referencia:"630423",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Cesullas — 1 km del mar",municipio:"Cabana de Bergantiños",barrio:"Cesullas",precio:18500,precio_anterior:2e4,descuento_pct:-14,superficie_construida:null,superficie_parcela:1521,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,distancia_mar_km:1,estado:"reservado",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/cabana-de-bergantinos/cesullas/3086/10622580/es/",descripcion:"Solar urbano de 1.521 m² en Cesullas, a 1 km del mar. Precio rebajado un 14%.",imagen:null},{id:5,referencia:"752363",tipo:"terreno",subtipo:"parcela",titulo:"Parcela en Concheiros",municipio:"Santiago de Compostela",barrio:"Concheiros",precio:25e3,precio_anterior:45e3,descuento_pct:-44,superficie_construida:null,superficie_parcela:134,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"reservado",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/plot-of-land/santiago-de-compostela/concheiros/3086/25239127/es/",descripcion:"Parcela de 134 m² en Concheiros con una rebaja del 44% sobre el precio original.",imagen:null},{id:6,referencia:"738380",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Portomouro",municipio:"Val do Dubra",barrio:"Portomouro",precio:25e3,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:700,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/val-do-dubra/portomouro/3086/21587792/es/",descripcion:"Solar urbano de 700 m² en Portomouro, Val do Dubra.",imagen:null},{id:7,referencia:"735299",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Lestedo (A)",municipio:"Boqueixon",barrio:"Lestedo",precio:3e4,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:694,habitaciones:3,banos:1,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/boqueixon/lestedo/3086/21087113/es/",descripcion:"Solar urbano de 694 m² en Lestedo con proyecto de 3 hab. y 1 baño.",imagen:null},{id:8,referencia:"735298",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Lestedo (B)",municipio:"Boqueixon",barrio:"Lestedo",precio:3e4,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:637,habitaciones:3,banos:1,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/boqueixon/lestedo/3086/21087085/es/",descripcion:"Solar urbano de 637 m² en Lestedo contiguo al anterior. Mismo proyecto.",imagen:null},{id:9,referencia:"747893",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Sionlla",municipio:"Santiago de Compostela",barrio:"Sionlla",precio:38500,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/santiago-de-compostela/sionlla/3086/747893/es/",descripcion:"Solar urbano en Sionlla, zona de desarrollo industrial y logístico de Santiago.",imagen:null},{id:10,referencia:"750038",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Ordes",municipio:"Ordes",barrio:"Ordes",precio:44500,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/ordes/ordes/3086/750038/es/",descripcion:"Solar urbano en Ordes, municipio bien comunicado con Santiago.",imagen:null},{id:11,referencia:"752194",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Arins",municipio:"Santiago de Compostela",barrio:"Arins",precio:6e4,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/santiago-de-compostela/arins/3086/752194/es/",descripcion:"Solar urbano en Arins, zona residencial en expansión de Santiago.",imagen:null},{id:12,referencia:"755191",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Pontevea",municipio:"Teo",barrio:"Pontevea",precio:1e5,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/teo/pontevea/3086/755191/es/",descripcion:"Solar urbano en Pontevea, Teo. Zona residencial tranquila al sur de Santiago.",imagen:null},{id:13,referencia:"630483",tipo:"terreno",subtipo:"solar_urbanizable",titulo:"Suelo Urbanizable en Arzúa",municipio:"Arzua",barrio:"Arzúa",precio:115e3,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/building-site/arzua/arzua/3086/630483/es/",descripcion:"Suelo urbanizable en Arzúa, municipio del Camino Francés a Santiago.",imagen:null},{id:14,referencia:"759826",tipo:"terreno",subtipo:"solar_urbano",titulo:"Solar Urbano en Arins (B)",municipio:"Santiago de Compostela",barrio:"Arins",precio:148e3,precio_anterior:null,descuento_pct:null,superficie_construida:null,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/urban-plot-of-land/santiago-de-compostela/arins/3086/759826/es/",descripcion:"Solar urbano de mayor valor en Arins. Zona residencial en expansión.",imagen:null},{id:15,referencia:"750328",tipo:"garaje",subtipo:"garaje",titulo:"Garaje en Vista Alegre",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:22500,precio_anterior:null,descuento_pct:null,superficie_construida:28,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!0,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/vista-alegre/3086/24201416/es/",descripcion:"Plaza de garaje de 28 m² en Vista Alegre.",imagen:null},{id:16,referencia:"459271",tipo:"garaje",subtipo:"garaje",titulo:"Garaje en Juan XXIII",municipio:"Santiago de Compostela",barrio:"Juan XXIII",precio:26e3,precio_anterior:null,descuento_pct:null,superficie_construida:15,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!0,piscina:!1,estado:"reservado",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/juan-xxiii/3086/3903569/es/",descripcion:"Plaza de garaje de 15 m² en Juan XXIII. Actualmente reservada.",imagen:null},{id:17,referencia:"639655",tipo:"garaje",subtipo:"garaje",titulo:"Garaje en Ensanche",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:28e3,precio_anterior:29e3,descuento_pct:-10,superficie_construida:14,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!0,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/ensanche/3086/11030199/es/",descripcion:"Plaza de garaje de 14 m² en el Ensanche. Rebajada un 10%.",imagen:null},{id:18,referencia:"755169",tipo:"garaje",subtipo:"garaje",titulo:"Garaje en Ensanche (B)",municipio:"Santiago de Compostela",barrio:"Ensanche",precio:38500,precio_anterior:null,descuento_pct:null,superficie_construida:23,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!0,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/garage/santiago-de-compostela/ensanche/3086/755169/es/",descripcion:"Plaza de garaje de 23 m² en el Ensanche.",imagen:null},{id:19,referencia:"686102",tipo:"rustico",subtipo:"finca_rustica",titulo:"Propiedad Rústica en Escravitude",municipio:"Padron",barrio:"Escravitude",precio:3e4,precio_anterior:4e4,descuento_pct:-25,superficie_construida:null,superficie_parcela:2729,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!1,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/rustic-property/padron/escravitude/3086/15499149/es/",descripcion:"Propiedad rústica de 2.729 m² en Escravitude, Padrón. Rebajada un 25%.",imagen:null},{id:20,referencia:"716953",tipo:"local",subtipo:"local_comercial",titulo:"Local Comercial en Milladoiro",municipio:"Ames",barrio:"Milladoiro",precio:95e3,precio_anterior:null,descuento_pct:null,superficie_construida:183,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/ames/milladoiro/3086/716953/es/",descripcion:"Local comercial de 183 m² en Milladoiro, zona de alto tráfico comercial en Ames.",imagen:null},{id:21,referencia:"726540",tipo:"local",subtipo:"local_comercial",titulo:"Local Comercial en Zona Cacheiras",municipio:"Teo",barrio:"Zona Cacheiras",precio:22e4,precio_anterior:null,descuento_pct:null,superficie_construida:1259,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/teo/zona-cacheiras/3086/726540/es/",descripcion:"Gran local comercial de 1.259 m² en la zona de Cacheiras, Teo.",imagen:null},{id:22,referencia:"759798",tipo:"local",subtipo:"negocio",titulo:"Negocio en Sigueiro",municipio:"Oroso",barrio:"Sigueiro",precio:25e4,precio_anterior:null,descuento_pct:null,superficie_construida:81,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business/oroso/sigueiro/3086/759798/es/",descripcion:"Negocio de 81 m² en Sigueiro, Oroso. Municipio limítrofe con Santiago.",imagen:null},{id:23,referencia:"740676",tipo:"local",subtipo:"local_comercial",titulo:"Local Comercial en Picaraña",municipio:"Padron",barrio:"Picaraña",precio:26e4,precio_anterior:null,descuento_pct:null,superficie_construida:531,superficie_parcela:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/business-premise/padron/picara-na/3086/740676/es/",descripcion:"Gran local de 531 m² con 2 baños en Picaraña, Padrón.",imagen:null},{id:24,referencia:"737487",tipo:"nave",subtipo:"nave_industrial",titulo:"Nave Industrial en Sionlla",municipio:"Santiago de Compostela",barrio:"Sionlla",precio:7e5,precio_anterior:null,descuento_pct:null,superficie_construida:1426,superficie_parcela:null,habitaciones:0,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/industrial-unit/santiago-de-compostela/sionlla/3086/737487/es/",descripcion:"Gran nave industrial de 1.426 m² en el polígono de Sionlla. Acceso para transporte pesado.",imagen:null},{id:25,referencia:"545333",tipo:"edificio",subtipo:"edificio",titulo:"Edificio en San Lázaro",municipio:"Santiago de Compostela",barrio:"San Lázaro",precio:4e5,precio_anterior:null,descuento_pct:null,superficie_construida:1400,superficie_parcela:null,habitaciones:0,banos:0,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/building/santiago-de-compostela/san-lazaro/3086/545333/es/",descripcion:"Edificio completo de 1.400 m² en el barrio de San Lázaro, Santiago de Compostela.",imagen:null},{id:26,referencia:"484155",tipo:"piso",subtipo:"apartamento",titulo:"Apartamento en Plaza de Galicia",municipio:"Santiago de Compostela",barrio:"Plaza de Galicia",precio:2e5,precio_anterior:null,descuento_pct:null,superficie_construida:45,superficie_parcela:null,habitaciones:1,banos:1,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/apartment/santiago-de-compostela/plaza-de-galicia/3086/484155/es/",descripcion:"Apartamento de 45 m² en la céntrica Plaza de Galicia. 1 habitación, 1 baño.",imagen:null},{id:27,referencia:"713907",tipo:"piso",subtipo:"piso",titulo:"Piso Exterior en Vista Alegre (A)",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:208917,precio_anterior:null,descuento_pct:null,superficie_construida:91.31,superficie_parcela:null,habitaciones:2,banos:1,ascensor:!0,terraza:!1,garaje:!1,piscina:!1,exterior:!0,estado:"reservado",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/vista-alegre/3086/18252379/es/",descripcion:"Piso de 91.31 m² totalmente exterior con ascensor en Vista Alegre. 2 hab, 1 baño.",imagen:null},{id:28,referencia:"756172",tipo:"piso",subtipo:"piso",titulo:"Piso con Ascensor en Bertamiráns",municipio:"Ames",barrio:"Bertamiráns",precio:231245,precio_anterior:null,descuento_pct:null,superficie_construida:98,superficie_parcela:null,habitaciones:3,banos:2,ascensor:!0,terraza:!1,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/ames/bertamirans/3086/26755988/es/",descripcion:"Piso de 98 m² con ascensor en Bertamiráns. 3 hab, 2 baños. Nuevo.",imagen:null},{id:29,referencia:"712196",tipo:"piso",subtipo:"piso",titulo:"Piso Exterior con Terraza en Vista Alegre (B)",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:233928,precio_anterior:null,descuento_pct:null,superficie_construida:113,superficie_parcela:null,superficie_extra:9.38,habitaciones:2,banos:1,ascensor:!1,terraza:!0,garaje:!1,piscina:!1,exterior:!1,estado:"reservado",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/vista-alegre/3086/18083124/es/",descripcion:"Piso de 113 m² con 9.38 m² de terraza en Vista Alegre. 2 hab, 1 baño.",imagen:null},{id:30,referencia:"718126",tipo:"piso",subtipo:"piso",titulo:"Piso con Terraza en Vista Alegre (C)",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:251111,precio_anterior:null,descuento_pct:null,superficie_construida:131,superficie_parcela:null,superficie_extra:18,habitaciones:3,banos:2,ascensor:!1,terraza:!0,garaje:!1,piscina:!1,exterior:!1,estado:"reservado",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/vista-alegre/3086/18677937/es/",descripcion:"Piso de 131 m² con 18 m² de terraza en Vista Alegre. 3 hab, 2 baños.",imagen:null},{id:31,referencia:"756282",tipo:"piso",subtipo:"piso",titulo:"Piso Exterior con Ascensor en Bertamiráns",municipio:"Ames",barrio:"Bertamiráns",precio:173058,precio_anterior:null,descuento_pct:null,superficie_construida:63,superficie_parcela:null,habitaciones:1,banos:1,ascensor:!0,terraza:!1,garaje:!1,piscina:!1,exterior:!0,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/ames/bertamirans/3086/26786127/es/",descripcion:"Piso de 63 m² totalmente exterior con ascensor en Bertamiráns. 1 hab, 1 baño.",imagen:null},{id:32,referencia:"759934",tipo:"piso",subtipo:"piso",titulo:"Piso en Hórreo",municipio:"Santiago de Compostela",barrio:"Hórreo",precio:395e3,precio_anterior:null,descuento_pct:null,superficie_construida:165,superficie_parcela:null,habitaciones:5,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/flat/santiago-de-compostela/horreo/3086/759934/es/",descripcion:"Amplio piso de 165 m² con 5 habitaciones y 2 baños en el barrio del Hórreo.",imagen:null},{id:33,referencia:"701888",tipo:"duplex",subtipo:"duplex",titulo:"Dúplex con Jardín en Vista Alegre",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:333178,precio_anterior:null,descuento_pct:null,superficie_construida:129.31,superficie_parcela:112,habitaciones:3,banos:3,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/duplex/santiago-de-compostela/vista-alegre/3086/17091870/es/",descripcion:"Dúplex de 129.31 m² con 112 m² de jardín en Vista Alegre. 3 hab, 2 baños completos.",imagen:null},{id:34,referencia:"759690",tipo:"duplex",subtipo:"duplex",titulo:"Dúplex en Castiñeiriño",municipio:"Santiago de Compostela",barrio:"Castiñeiriño - Cruceiro do Sar",precio:395e3,precio_anterior:null,descuento_pct:null,superficie_construida:139,superficie_parcela:null,habitaciones:4,banos:3,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/duplex/santiago-de-compostela/castiñeirino-cruceiro-do-sar/3086/759690/es/",descripcion:"Dúplex de 139 m² en Castiñeiriño-Cruceiro do Sar. 4 hab, 3 baños.",imagen:null},{id:35,referencia:"753876",tipo:"adosado",subtipo:"adosado",titulo:"Adosado con Jardín — Campus Norte",municipio:"Santiago de Compostela",barrio:"Campus Norte - S. Caetano",precio:369e3,precio_anterior:null,descuento_pct:null,superficie_construida:209,superficie_parcela:50,habitaciones:4,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/terraced-house/santiago-de-compostela/campus-norte-s-caetano/3086/26040599/es/",descripcion:"Adosado de 209 m² con 50 m² de jardín en Campus Norte. 4 hab, 2 baños.",imagen:null},{id:36,referencia:"752285",tipo:"adosado",subtipo:"adosado",titulo:"Adosado con Jardín y Terraza — Vista Alegre",municipio:"Santiago de Compostela",barrio:"Vista Alegre",precio:369e3,precio_anterior:null,descuento_pct:null,superficie_construida:209,superficie_parcela:50,superficie_extra:43,habitaciones:4,banos:2,ascensor:!1,terraza:!0,garaje:!1,piscina:!1,exterior:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/terraced-house/santiago-de-compostela/vista-alegre/3086/25180006/es/",descripcion:"Adosado de 209 m² con 50 m² de jardín y 43 m² de terraza en Vista Alegre. 4 hab, 2 baños.",imagen:null},{id:37,referencia:"752324",tipo:"casa",subtipo:"casa",titulo:"Casa en O Pino",municipio:"O Pino",barrio:"Galicia",precio:14e4,precio_anterior:null,descuento_pct:null,superficie_construida:204,superficie_parcela:null,habitaciones:3,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/o-pino/galicia/3086/752324/es/",descripcion:"Casa de 204 m² en O Pino, municipio próximo a Santiago. 3 hab, 2 baños.",imagen:null},{id:38,referencia:"741438",tipo:"casa",subtipo:"casa",titulo:"Casa en Negreira",municipio:"Negreira",barrio:"Negreira",precio:19e4,precio_anterior:null,descuento_pct:null,superficie_construida:280,superficie_parcela:null,habitaciones:3,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/negreira/negreira/3086/741438/es/",descripcion:"Amplia casa de 280 m² en Negreira. 3 hab, 2 baños.",imagen:null},{id:39,referencia:"749655",tipo:"casa",subtipo:"casa",titulo:"Casa en Casco Histórico (A)",municipio:"Santiago de Compostela",barrio:"Casco Histórico",precio:26e4,precio_anterior:null,descuento_pct:null,superficie_construida:227,superficie_parcela:null,habitaciones:4,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/santiago-de-compostela/casco-historico/3086/749655/es/",descripcion:"Casa de 227 m² en el Casco Histórico de Santiago. 4 hab, 2 baños.",imagen:null},{id:40,referencia:"752114",tipo:"casa",subtipo:"casa",titulo:"Casa en Cerceda",municipio:"O Pino",barrio:"Cerceda 1",precio:299e3,precio_anterior:null,descuento_pct:null,superficie_construida:245,superficie_parcela:null,habitaciones:7,banos:4,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/o-pino/cerceda-1/3086/752114/es/",descripcion:"Gran casa de 245 m² en Cerceda con 7 hab y 4 baños. Ideal para familia numerosa.",imagen:null},{id:41,referencia:"713098",tipo:"casa",subtipo:"casa",titulo:"Casa en Rúa de San Pedro",municipio:"Santiago de Compostela",barrio:"Rúa de San Pedro",precio:3e5,precio_anterior:null,descuento_pct:null,superficie_construida:160,superficie_parcela:null,habitaciones:3,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/santiago-de-compostela/rua-de-san-pedro/3086/713098/es/",descripcion:"Casa de 160 m² en la Rúa de San Pedro, entrada del Camino Francés al casco histórico.",imagen:null},{id:42,referencia:"745612",tipo:"casa",subtipo:"casa",titulo:"Casa en Santiago de Compostela",municipio:"Santiago de Compostela",barrio:null,precio:35e4,precio_anterior:null,descuento_pct:null,superficie_construida:150,superficie_parcela:null,habitaciones:3,banos:2,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/santiago-de-compostela/3086/745612/es/",descripcion:"Casa de 150 m² en Santiago de Compostela. 3 hab, 2 baños.",imagen:null},{id:43,referencia:"601677",tipo:"casa",subtipo:"casa",titulo:"Casa en Casco Histórico (B)",municipio:"Santiago de Compostela",barrio:"Casco Histórico",precio:45e4,precio_anterior:null,descuento_pct:null,superficie_construida:380,superficie_parcela:null,habitaciones:7,banos:4,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/santiago-de-compostela/casco-historico/3086/601677/es/",descripcion:"Gran casa de 380 m² en el Casco Histórico. 7 hab, 4 baños. Inmueble excepcional.",imagen:null},{id:44,referencia:"748993",tipo:"casa",subtipo:"casa",titulo:"Casa en Campus Norte",municipio:"Santiago de Compostela",barrio:"Campus Norte - S. Caetano",precio:5e5,precio_anterior:null,descuento_pct:null,superficie_construida:150,superficie_parcela:null,habitaciones:3,banos:3,ascensor:!1,terraza:!1,garaje:!1,piscina:!1,estado:"disponible",destacado:!0,url_ficha:"https://www.best-house.es/santiagodecompostelazonanueva/ficha/house/santiago-de-compostela/campus-norte-s-caetano/3086/748993/es/",descripcion:"Casa de 150 m² junto al Campus Norte. 3 hab, 3 baños completos.",imagen:null}],C=()=>p.filter(a=>a.estado==="disponible"),S=()=>p.filter(a=>a.estado==="reservado"),j=()=>p.filter(a=>a.descuento_pct!==null);p.length,116-p.length,C().length,S().length,j().length,Math.min(...p.filter(a=>a.precio).map(a=>a.precio)),Math.max(...p.filter(a=>a.precio).map(a=>a.precio)),[...new Set(p.map(a=>a.tipo))],[...new Set(p.map(a=>a.municipio))].sort(),p.reduce((a,i)=>(a[i.tipo]=(a[i.tipo]||0)+1,a),{});class A extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["title","price","image","location"]}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){const i=this.getAttribute("title")||"Propiedad Premium",r=this.getAttribute("price")||"Consultar",t=this.getAttribute("image")||"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",o=this.getAttribute("location")||"Santiago de Compostela";this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: block;
        }
        .card {
          background: rgba(15, 23, 42, 0.4);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
          color: #f8fafc;
          font-family: 'Inter', sans-serif;
        }
        
        .card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.6);
          border-color: rgba(251, 191, 36, 0.4);
        }

        .image-container {
          width: 100%;
          height: 240px;
          overflow: hidden;
          position: relative;
        }

        .image-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .card:hover .image-container img {
          transform: scale(1.05);
        }

        .content {
          padding: 20px;
        }

        .price {
          color: #fbbf24;
          font-size: 1.5rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        h3 {
          margin: 0 0 8px 0;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .location {
          color: #cbd5e1;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        /* Health Score Container */
        .health-score-wrapper {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 10;
        }
      </style>
      
      <div class="card">
        <div class="image-container">
          <img src="${t}" alt="${i}" loading="lazy"/>
          <div class="health-score-wrapper">
            <slot name="health-score"></slot>
          </div>
        </div>
        <div class="content">
          <div class="price">${r}</div>
          <h3>${i}</h3>
          <div class="location">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            ${o}
          </div>
        </div>
      </div>
    `}}customElements.define("property-card",A);class P extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"})}static get observedAttributes(){return["solar-exposure","tranquility","services-index"]}connectedCallback(){this.render()}attributeChangedCallback(){this.render()}render(){const i=parseInt(this.getAttribute("solar-exposure")||"80"),r=parseInt(this.getAttribute("tranquility")||"85"),t=parseInt(this.getAttribute("services-index")||"90"),o=Math.round((i+r+t)/3);this.shadowRoot.innerHTML=`
      <style>
        :host {
          display: inline-block;
        }
        .score-badge {
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(251, 191, 36, 0.5);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          color: #fbbf24;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
          position: relative;
          cursor: pointer;
        }

        .tooltip {
          visibility: hidden;
          opacity: 0;
          position: absolute;
          top: -10px;
          right: 60px; /* To the left of the badge */
          width: 240px;
          background: rgba(15, 23, 42, 0.95);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border-radius: 12px;
          padding: 12px;
          color: #f8fafc;
          font-size: 0.8rem;
          transition: all 0.3s ease;
          transform: translateX(10px);
          pointer-events: none;
        }

        .score-badge:hover .tooltip {
          visibility: visible;
          opacity: 1;
          transform: translateX(0);
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 6px;
        }
        
        .stat-bar-container {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          margin-bottom: 10px;
          overflow: hidden;
        }
        
        .stat-bar {
          height: 100%;
          background: var(--accent-amber, #fbbf24);
          border-radius: 2px;
        }
      </style>
      
      <div class="score-badge">
        ${o}
        <div class="tooltip">
          <div style="font-weight:600; text-align:center; color:#fbbf24; margin-bottom:8px">Lifestyle Index</div>
          
          <div class="stat-row"><span>☀️ Incidencia Solar</span><span>${i}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${i}%"></div></div>
          
          <div class="stat-row"><span>🍃 Silencio/Zonas Verdes</span><span>${r}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${r}%"></div></div>
          
          <div class="stat-row"><span>📍 Conexión/Ubicación</span><span>${t}</span></div>
          <div class="stat-bar-container"><div class="stat-bar" style="width: ${t}%"></div></div>
        </div>
      </div>
    `}}customElements.define("lifestyle-index",P);class E extends HTMLElement{constructor(){super(),this.attachShadow({mode:"open"}),this.isOpen=!1}connectedCallback(){this.render(),this.setupListeners()}render(){this.shadowRoot.innerHTML=`
      <style>
        :host {
          position: fixed;
          bottom: 24px;
          right: 24px;
          z-index: 1000;
          font-family: 'Inter', sans-serif;
        }

        .fab {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px rgba(245, 158, 11, 0.4);
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          color: #0f172a;
        }

        .fab:hover {
          transform: scale(1.05);
          box-shadow: 0 15px 35px rgba(245, 158, 11, 0.6);
        }

        .chat-window {
          position: absolute;
          bottom: 80px;
          right: 0;
          width: 350px;
          height: 500px;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
          transform-origin: bottom right;
          transition: opacity 0.3s ease, transform 0.3s ease;
          
          /* Hidden state */
          opacity: 0;
          transform: scale(0.9) translateY(20px);
          pointer-events: none;
        }

        .chat-window.open {
          opacity: 1;
          transform: scale(1) translateY(0);
          pointer-events: all;
        }

        .header {
          padding: 16px 20px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #334155;
          display:flex; align-items:center; justify-content:center;
          font-size: 1.2rem;
        }

        .header-info h4 {
          margin: 0; color: #f8fafc; font-size: 1rem;
        }
        .header-info p {
          margin: 0; color: #fbbf24; font-size: 0.8rem;
        }

        .messages {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .msg {
          max-width: 80%;
          padding: 10px 14px;
          border-radius: 12px;
          font-size: 0.9rem;
          line-height: 1.4;
        }

        .msg.alex {
          background: rgba(255,255,255,0.1);
          color: #f8fafc;
          align-self: flex-start;
          border-bottom-left-radius: 4px;
        }

        .msg.user {
          background: rgba(251, 191, 36, 0.2);
          color: #fbbf24;
          align-self: flex-end;
          border-bottom-right-radius: 4px;
        }

        .input-area {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          gap: 8px;
        }

        input {
          flex: 1;
          background: rgba(0,0,0,0.2);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          border-radius: 20px;
          padding: 10px 16px;
          outline: none;
          font-family: inherit;
        }

        button.send {
          background: transparent;
          border: none;
          color: #fbbf24;
          cursor: pointer;
          display: flex; align-items:center; justify-content:center;
        }
      </style>

      <div class="fab" id="fab">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
      </div>

      <div class="chat-window" id="chat">
        <div class="header">
          <div class="avatar">👨‍💼</div>
          <div class="header-info">
            <h4>Alex (Asesor IA)</h4>
            <p>Conectado a Inmovilla & N8N</p>
          </div>
        </div>
        <div class="messages" id="msgs">
          <div class="msg alex">¡Hola! Soy Alex, tu Broker Inmobiliario Premium. ¿Buscas maximizar tu rentabilidad en Santiago o priorizas una excelente orientación solar y calidad constructiva?</div>
        </div>
        <div class="input-area">
          <input type="text" id="chatInput" placeholder="Pregunta sobre una zona...">
          <button class="send" id="sendBtn">
             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
          </button>
        </div>
      </div>
    `}setupListeners(){const i=this.shadowRoot.getElementById("fab"),r=this.shadowRoot.getElementById("chat"),t=this.shadowRoot.getElementById("sendBtn"),o=this.shadowRoot.getElementById("chatInput"),e=this.shadowRoot.getElementById("msgs");i.addEventListener("click",()=>{this.isOpen=!this.isOpen,this.isOpen?r.classList.add("open"):r.classList.remove("open")});const n=()=>{const c=o.value.trim();if(!c)return;const s=document.createElement("div");s.className="msg user",s.textContent=c,e.appendChild(s),o.value="",setTimeout(()=>{const l=document.createElement("div");l.className="msg alex",l.textContent="Excelente criterio. Analizaré la incidencia solar, rentabilidad estimada por zona y te mostraré opciones de alta gama. Conectando con N8N...",e.appendChild(l),e.scrollTop=e.scrollHeight},1e3),e.scrollTop=e.scrollHeight};t.addEventListener("click",n),o.addEventListener("keypress",c=>{c.key==="Enter"&&n()})}}customElements.define("broker-alex",E);console.log("Midnight Gold Engine Initialized");function f(a="todos",i=u,r=null){const t=document.querySelector(".property-grid");if(!t)return;t.innerHTML="";let o=i;if(a==="alquiler_pisos"?o=i.filter(e=>e.tipo==="piso"&&e.precio!==null):a==="venta"?o=i.filter(e=>e.precio!==null):a==="destacados"&&(o=i.slice(0,6)),r&&(o=o.slice(0,r)),o.length===0){t.innerHTML='<p style="color: var(--text-slate); text-align: center; grid-column: 1/-1;">No hay propiedades que coincidan con la búsqueda.</p>';return}o.forEach(e=>{e.exterior?Math.floor(Math.random()*15)+85:Math.floor(Math.random()*30)+40,e.barrio==="Ensanche"||e.barrio,e.barrio==="Ensanche"||e.barrio;const n=e.imagen||"https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",c=e.unidad_precio==="mes"||e.precio<5e3&&e.tipo!=="garaje"&&e.tipo!=="terreno",s=`
      <div class="glass-panel property-card" style="padding: 0; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 240px; position: relative;">
          <img src="${n}" alt="${e.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
          ${e.estado==="reservado"?'<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(239, 68, 68, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">RESERVADO</span>':""}
          ${e.estado==="opcion_compra"?'<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(59, 130, 246, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">Venta o Alquiler</span>':""}
          ${e.estado==="disponible"?'<span style="color: white; position: absolute; top: 10px; left: 10px; background: rgba(34, 197, 94, 0.9); padding: 6px 12px; border-radius: 4px; font-weight: bold; font-size: 0.8rem; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">DISPONIBLE</span>':""}
          <div style="position: absolute; right: 20px; bottom: 10px; width: 50px; height: 50px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 6px rgba(0,0,0,0.3); overflow: hidden;">
              <img src="./img/LOGO_BEST_HOUSE_RECTANGULAR.png" alt="Best House Logo" style="width: 100%; height: 100%; object-fit: contain; transform: scale(1.2);">
          </div>
        </div>

        <div style="padding: 1.5rem; display: flex; flex-direction: column; flex-grow: 1;">
          <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.5rem;">
            <h2 style="color: var(--brand-blue); font-size: 1.8rem; font-weight: 800; margin: 0;">
              ${e.precio?e.precio.toLocaleString()+" €"+(c?"/mes":""):"Consultar"}
            </h2>
            <span style="color: #94a3b8; font-size: 0.8rem;">Ref. ${e.referencia}</span>
          </div>
          <h3 style="color: var(--text-slate); font-size: 1.1rem; font-weight: 600; margin-bottom: 0.8rem; line-height: 1.4;">${e.titulo}</h3>
          <p style="color: #475569; font-size: 0.95rem; margin-bottom: 1rem; display: flex; flex-wrap: wrap; gap: 8px; align-items: center;">
            ${e.habitaciones?`<span><strong>${e.habitaciones}</strong> habs.</span>`:""}
            ${e.banos?`<span><strong>${e.banos}</strong> baños</span>`:""}
            ${e.superficie_construida?`<span><strong>${e.superficie_construida}</strong> m²</span>`:""}
            <span style="text-transform: capitalize;">${e.tipo}</span>
          </p>
          <div style="margin-top: auto; padding-top: 1rem; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; gap: 0.5rem;">
              <a href="tel:881123462" class="btn-card-secondary">Llamar</a>
              <a href="mailto:santiago@best-house.com" class="btn-card-primary">Contactar</a>
            </div>
          </div>
        </div>
      </div>
    `;t.innerHTML+=s})}function x(){const a=window.location.pathname,i=document.querySelector(".properties-section h2");a.includes("alquiler.html")?(i&&(i.textContent="Catálogo Completo: Alquiler (21 Inmuebles)"),f("todos"),z(u)):a.includes("venta.html")?(i&&(i.textContent="Catálogo Completo: Venta (44 Inmuebles)"),f("todos",p),z(p)):(i&&(i.textContent="Últimas Novedades Inmobiliarias"),document.querySelector(".property-grid")&&f("destacados",u));const r=document.querySelector(".fotocasa-search-btn");r&&r.addEventListener("click",t=>{var h,g,_,w;t.preventDefault();const o=((h=document.getElementById("operacion"))==null?void 0:h.value)||"comprar",e=((g=document.getElementById("zona"))==null?void 0:g.value)||"",n=e.trim().toLowerCase(),c=((_=document.getElementById("tipo"))==null?void 0:_.value)||"";console.log(`[N8N Tracker] Intención capturada: Búsqueda ejecutada (Operación: ${o}, Zona: ${n})`);let l=o==="alquilar"?u:p;n&&(l=l.filter(d=>d.municipio&&d.municipio.toLowerCase().includes(n)||d.barrio&&d.barrio.toLowerCase().includes(n)||d.provincia&&d.provincia.toLowerCase().includes(n))),c&&c!=="vivienda"&&(l=l.filter(d=>d.tipo&&d.tipo.toLowerCase().includes(c))),l.slice(0,6);const b=document.querySelector(".properties-section h2");if(b){const d=e?` en ${e}`:"";b.textContent=`Resultados: ${l.length} Inmuebles${d} para ${o==="alquilar"?"alquilar":"comprar"}`}f("custom",l,6),(w=document.querySelector(".properties-section"))==null||w.scrollIntoView({behavior:"smooth"})})}const m=document.querySelectorAll(".search-tab"),v=document.getElementById("operacion");m.length>0&&m.forEach(a=>{a.addEventListener("click",i=>{i.preventDefault(),m.forEach(r=>{r.classList.remove("active"),r.style.borderBottom=""}),a.classList.add("active"),v&&(v.value=a.getAttribute("data-type"))})});function z(a){const i=document.getElementById("btn-aplicar-filtros");i&&i.addEventListener("click",()=>{const r=document.getElementById("filter-tipo").value,t=parseInt(document.getElementById("filter-hab").value)||0,o=parseFloat(document.getElementById("filter-precio-max").value)||1/0;let e=a;r&&(r==="piso"?e=e.filter(s=>s.tipo==="piso"||s.tipo==="apartamento"||s.tipo==="duplex"):r==="casa"?e=e.filter(s=>s.tipo==="casa"||s.tipo==="adosado"):r==="terreno"?e=e.filter(s=>s.tipo==="terreno"||s.tipo==="rustico"):r==="local"?e=e.filter(s=>s.tipo==="local"||s.tipo==="nave"):e=e.filter(s=>s.tipo===r)),t>0&&(e=e.filter(s=>(s.habitaciones||0)>=t)),o!==1/0&&o>0&&(e=e.filter(s=>s.precio!==null&&s.precio<=o));const n=document.getElementById("filter-orden")?document.getElementById("filter-orden").value:"";n==="asc"?e=e.sort((s,l)=>(s.precio||1/0)-(l.precio||1/0)):n==="desc"&&(e=e.sort((s,l)=>(l.precio||0)-(s.precio||0))),f("custom",e);const c=document.querySelector(".properties-section h2");c&&(c.textContent=`Resultados: ${e.length} Propiedades`)})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",x):x();
