/* ==========================================================================
   PITCH_CORE_V2.0 — GLOBAL FOOTBALL PLATFORM & MULTI-TOURNAMENT SIMULATION ENGINE
   - Dual Worlds: World A (Real Football Data) & World B (Hypothetical Simulation)
   - 10 Competitions: World Cup, UCL, Premier League, La Liga, Serie A, Bundesliga,
     Europa League, Euro 2024, Copa América, Copa Libertadores.
   - Precomputed Poisson Simulation, Shared 60s Knockout Clock, Individual Match Simulation,
     Pause/Resume/Restart/Skip Controls, Extra Time & Penalties, Highlights Hub.
   ========================================================================== */

(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1. OFFICIAL CRESTS & FLAGS REGISTRY (ALL 10 COMPETITIONS)
  // ---------------------------------------------------------------------------
  const OFFICIAL_LOGOS = {
    // --- PREMIER LEAGUE ---
    'man city': 'https://images.fotmob.com/image_resources/logo/teamlogo/8456.png',
    'manchester city': 'https://images.fotmob.com/image_resources/logo/teamlogo/8456.png',
    'arsenal': 'https://images.fotmob.com/image_resources/logo/teamlogo/9825.png',
    'liverpool': 'https://images.fotmob.com/image_resources/logo/teamlogo/8650.png',
    'aston villa': 'https://images.fotmob.com/image_resources/logo/teamlogo/10252.png',
    'tottenham': 'https://images.fotmob.com/image_resources/logo/teamlogo/8586.png',
    'chelsea': 'https://images.fotmob.com/image_resources/logo/teamlogo/8455.png',
    'newcastle': 'https://images.fotmob.com/image_resources/logo/teamlogo/10261.png',
    'man united': 'https://images.fotmob.com/image_resources/logo/teamlogo/10260.png',
    'manchester united': 'https://images.fotmob.com/image_resources/logo/teamlogo/10260.png',
    'west ham': 'https://images.fotmob.com/image_resources/logo/teamlogo/8654.png',
    'brighton': 'https://images.fotmob.com/image_resources/logo/teamlogo/10204.png',
    'bournemouth': 'https://images.fotmob.com/image_resources/logo/teamlogo/8678.png',
    'crystal palace': 'https://images.fotmob.com/image_resources/logo/teamlogo/9826.png',
    'wolves': 'https://images.fotmob.com/image_resources/logo/teamlogo/8602.png',
    'fulham': 'https://images.fotmob.com/image_resources/logo/teamlogo/9879.png',
    'everton': 'https://images.fotmob.com/image_resources/logo/teamlogo/8668.png',
    'brentford': 'https://images.fotmob.com/image_resources/logo/teamlogo/9937.png',
    'nottingham forest': 'https://images.fotmob.com/image_resources/logo/teamlogo/10203.png',
    'leicester city': 'https://images.fotmob.com/image_resources/logo/teamlogo/8197.png',
    'ipswich town': 'https://images.fotmob.com/image_resources/logo/teamlogo/9832.png',
    'southampton': 'https://images.fotmob.com/image_resources/logo/teamlogo/8466.png',

    // --- LA LIGA ---
    'real madrid': 'https://images.fotmob.com/image_resources/logo/teamlogo/8633.png',
    'barcelona': 'https://images.fotmob.com/image_resources/logo/teamlogo/8634.png',
    'girona': 'https://images.fotmob.com/image_resources/logo/teamlogo/7732.png',
    'atletico madrid': 'https://images.fotmob.com/image_resources/logo/teamlogo/9906.png',
    'athletic club': 'https://images.fotmob.com/image_resources/logo/teamlogo/8315.png',
    'real sociedad': 'https://images.fotmob.com/image_resources/logo/teamlogo/8560.png',
    'real betis': 'https://images.fotmob.com/image_resources/logo/teamlogo/8603.png',
    'villarreal': 'https://images.fotmob.com/image_resources/logo/teamlogo/10205.png',
    'valencia': 'https://images.fotmob.com/image_resources/logo/teamlogo/10267.png',
    'alaves': 'https://images.fotmob.com/image_resources/logo/teamlogo/9866.png',
    'osasuna': 'https://images.fotmob.com/image_resources/logo/teamlogo/8371.png',
    'getafe': 'https://images.fotmob.com/image_resources/logo/teamlogo/8305.png',
    'celta vigo': 'https://images.fotmob.com/image_resources/logo/teamlogo/9910.png',
    'sevilla': 'https://images.fotmob.com/image_resources/logo/teamlogo/8302.png',
    'mallorca': 'https://images.fotmob.com/image_resources/logo/teamlogo/8661.png',
    'las palmas': 'https://images.fotmob.com/image_resources/logo/teamlogo/8306.png',
    'rayo vallecano': 'https://images.fotmob.com/image_resources/logo/teamlogo/8370.png',
    'leganes': 'https://images.fotmob.com/image_resources/logo/teamlogo/7854.png',
    'valladolid': 'https://images.fotmob.com/image_resources/logo/teamlogo/10284.png',
    'espanyol': 'https://images.fotmob.com/image_resources/logo/teamlogo/8558.png',

    // --- SERIE A ---
    'inter milan': 'https://images.fotmob.com/image_resources/logo/teamlogo/8636.png',
    'inter': 'https://images.fotmob.com/image_resources/logo/teamlogo/8636.png',
    'internazionale': 'https://images.fotmob.com/image_resources/logo/teamlogo/8636.png',
    'ac milan': 'https://images.fotmob.com/image_resources/logo/teamlogo/8564.png',
    'juventus': 'https://images.fotmob.com/image_resources/logo/teamlogo/9885.png',
    'atalanta': 'https://images.fotmob.com/image_resources/logo/teamlogo/8524.png',
    'bologna': 'https://images.fotmob.com/image_resources/logo/teamlogo/9857.png',
    'as roma': 'https://images.fotmob.com/image_resources/logo/teamlogo/8686.png',
    'lazio': 'https://images.fotmob.com/image_resources/logo/teamlogo/8543.png',
    'fiorentina': 'https://images.fotmob.com/image_resources/logo/teamlogo/8535.png',
    'torino': 'https://images.fotmob.com/image_resources/logo/teamlogo/9881.png',
    'napoli': 'https://images.fotmob.com/image_resources/logo/teamlogo/9875.png',
    'genoa': 'https://images.fotmob.com/image_resources/logo/teamlogo/10233.png',
    'monza': 'https://images.fotmob.com/image_resources/logo/teamlogo/6504.png',
    'hellas verona': 'https://images.fotmob.com/image_resources/logo/teamlogo/9876.png',
    'lecce': 'https://images.fotmob.com/image_resources/logo/teamlogo/9888.png',
    'udinese': 'https://images.fotmob.com/image_resources/logo/teamlogo/8600.png',
    'cagliari': 'https://images.fotmob.com/image_resources/logo/teamlogo/8529.png',
    'empoli': 'https://images.fotmob.com/image_resources/logo/teamlogo/8534.png',
    'parma': 'https://images.fotmob.com/image_resources/logo/teamlogo/10171.png',
    'como': 'https://images.fotmob.com/image_resources/logo/teamlogo/10174.png',
    'venezia': 'https://images.fotmob.com/image_resources/logo/teamlogo/7881.png',

    // --- BUNDESLIGA ---
    'bayer leverkusen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8178.png',
    'leverkusen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8178.png',
    'stuttgart': 'https://images.fotmob.com/image_resources/logo/teamlogo/10269.png',
    'bayern munich': 'https://images.fotmob.com/image_resources/logo/teamlogo/9823.png',
    'bayern': 'https://images.fotmob.com/image_resources/logo/teamlogo/9823.png',
    'rb leipzig': 'https://images.fotmob.com/image_resources/logo/teamlogo/178475.png',
    'dortmund': 'https://images.fotmob.com/image_resources/logo/teamlogo/9789.png',
    'borussia dortmund': 'https://images.fotmob.com/image_resources/logo/teamlogo/9789.png',
    'eintracht frankfurt': 'https://images.fotmob.com/image_resources/logo/teamlogo/9810.png',
    'hoffenheim': 'https://images.fotmob.com/image_resources/logo/teamlogo/8226.png',
    'heidenheim': 'https://images.fotmob.com/image_resources/logo/teamlogo/8221.png',
    'werder bremen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8690.png',
    'freiburg': 'https://images.fotmob.com/image_resources/logo/teamlogo/8358.png',
    'augsburg': 'https://images.fotmob.com/image_resources/logo/teamlogo/8406.png',
    'wolfsburg': 'https://images.fotmob.com/image_resources/logo/teamlogo/8721.png',
    'mainz 05': 'https://images.fotmob.com/image_resources/logo/teamlogo/9905.png',
    'm’gladbach': 'https://images.fotmob.com/image_resources/logo/teamlogo/9788.png',
    'union berlin': 'https://images.fotmob.com/image_resources/logo/teamlogo/8536.png',
    'bochum': 'https://images.fotmob.com/image_resources/logo/teamlogo/9911.png',
    'st. pauli': 'https://images.fotmob.com/image_resources/logo/teamlogo/8152.png',
    'holstein kiel': 'https://images.fotmob.com/image_resources/logo/teamlogo/8224.png',

    // --- SCOTTISH PREMIERSHIP ---
    'celtic': 'https://images.fotmob.com/image_resources/logo/teamlogo/9925.png',
    'celtic fc': 'https://images.fotmob.com/image_resources/logo/teamlogo/9925.png',
    'rangers': 'https://images.fotmob.com/image_resources/logo/teamlogo/9927.png',
    'rangers fc': 'https://images.fotmob.com/image_resources/logo/teamlogo/9927.png',
    'hearts': 'https://images.fotmob.com/image_resources/logo/teamlogo/8485.png',
    'heart of midlothian': 'https://images.fotmob.com/image_resources/logo/teamlogo/8485.png',
    'kilmarnock': 'https://images.fotmob.com/image_resources/logo/teamlogo/8487.png',
    'st. mirren': 'https://images.fotmob.com/image_resources/logo/teamlogo/8491.png',
    'st mirren': 'https://images.fotmob.com/image_resources/logo/teamlogo/8491.png',
    'saint mirren': 'https://images.fotmob.com/image_resources/logo/teamlogo/8491.png',
    'dundee': 'https://images.fotmob.com/image_resources/logo/teamlogo/8484.png',
    'dundee fc': 'https://images.fotmob.com/image_resources/logo/teamlogo/8484.png',
    'aberdeen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8483.png',
    'hibernian': 'https://images.fotmob.com/image_resources/logo/teamlogo/8486.png',
    'hibs': 'https://images.fotmob.com/image_resources/logo/teamlogo/8486.png',
    'motherwell': 'https://images.fotmob.com/image_resources/logo/teamlogo/8489.png',
    'st. johnstone': 'https://images.fotmob.com/image_resources/logo/teamlogo/8490.png',
    'st johnstone': 'https://images.fotmob.com/image_resources/logo/teamlogo/8490.png',
    'saint johnstone': 'https://images.fotmob.com/image_resources/logo/teamlogo/8490.png',
    'ross county': 'https://images.fotmob.com/image_resources/logo/teamlogo/8492.png',
    'dundee united': 'https://images.fotmob.com/image_resources/logo/teamlogo/8488.png',
    'dundee utd': 'https://images.fotmob.com/image_resources/logo/teamlogo/8488.png',

    // --- LIGUE 1 ---
    'psg': 'https://images.fotmob.com/image_resources/logo/teamlogo/9847.png',
    'paris saint-germain': 'https://images.fotmob.com/image_resources/logo/teamlogo/9847.png',
    'monaco': 'https://images.fotmob.com/image_resources/logo/teamlogo/9829.png',
    'as monaco': 'https://images.fotmob.com/image_resources/logo/teamlogo/9829.png',
    'brest': 'https://images.fotmob.com/image_resources/logo/teamlogo/8521.png',
    'lille': 'https://images.fotmob.com/image_resources/logo/teamlogo/8639.png',
    'nice': 'https://images.fotmob.com/image_resources/logo/teamlogo/9831.png',
    'lyon': 'https://images.fotmob.com/image_resources/logo/teamlogo/9748.png',
    'lens': 'https://images.fotmob.com/image_resources/logo/teamlogo/8588.png',
    'marseille': 'https://images.fotmob.com/image_resources/logo/teamlogo/8592.png',
    'reims': 'https://images.fotmob.com/image_resources/logo/teamlogo/9837.png',
    'rennes': 'https://images.fotmob.com/image_resources/logo/teamlogo/9851.png',
    'toulouse': 'https://images.fotmob.com/image_resources/logo/teamlogo/9941.png',
    'montpellier': 'https://images.fotmob.com/image_resources/logo/teamlogo/10249.png',
    'strasbourg': 'https://images.fotmob.com/image_resources/logo/teamlogo/9848.png',
    'nantes': 'https://images.fotmob.com/image_resources/logo/teamlogo/9830.png',
    'le havre': 'https://images.fotmob.com/image_resources/logo/teamlogo/9746.png',
    'angers': 'https://images.fotmob.com/image_resources/logo/teamlogo/8121.png',
    'auxerre': 'https://images.fotmob.com/image_resources/logo/teamlogo/8590.png',
    'saint-étienne': 'https://images.fotmob.com/image_resources/logo/teamlogo/8682.png',
    'saint etienne': 'https://images.fotmob.com/image_resources/logo/teamlogo/8682.png',

    // --- OTHER CONTINENTAL & EUROPEAN GIANTS ---
    'benfica': 'https://images.fotmob.com/image_resources/logo/teamlogo/9772.png',
    'sporting cp': 'https://images.fotmob.com/image_resources/logo/teamlogo/9768.png',
    'sporting': 'https://images.fotmob.com/image_resources/logo/teamlogo/9768.png',
    'porto': 'https://images.fotmob.com/image_resources/logo/teamlogo/9773.png',
    'fc porto': 'https://images.fotmob.com/image_resources/logo/teamlogo/9773.png',
    'braga': 'https://images.fotmob.com/image_resources/logo/teamlogo/9764.png',
    'sc braga': 'https://images.fotmob.com/image_resources/logo/teamlogo/9764.png',
    'vitória de guimarães': 'https://images.fotmob.com/image_resources/logo/teamlogo/9771.png',
    'vitoria de guimaraes': 'https://images.fotmob.com/image_resources/logo/teamlogo/9771.png',
    'moreirense': 'https://images.fotmob.com/image_resources/logo/teamlogo/8348.png',
    'arouca': 'https://images.fotmob.com/image_resources/logo/teamlogo/10202.png',
    'famalicão': 'https://images.fotmob.com/image_resources/logo/teamlogo/8344.png',
    'famalicao': 'https://images.fotmob.com/image_resources/logo/teamlogo/8344.png',
    'casa pia': 'https://images.fotmob.com/image_resources/logo/teamlogo/10189.png',
    'farense': 'https://images.fotmob.com/image_resources/logo/teamlogo/8349.png',
    'rio ave': 'https://images.fotmob.com/image_resources/logo/teamlogo/9770.png',
    'gil vicente': 'https://images.fotmob.com/image_resources/logo/teamlogo/9765.png',
    'estoril praia': 'https://images.fotmob.com/image_resources/logo/teamlogo/7842.png',
    'estrela da amadora': 'https://images.fotmob.com/image_resources/logo/teamlogo/10189.png',
    'boavista': 'https://images.fotmob.com/image_resources/logo/teamlogo/8613.png',
    'nacional': 'https://images.fotmob.com/image_resources/logo/teamlogo/9767.png',
    'santa clara': 'https://images.fotmob.com/image_resources/logo/teamlogo/8347.png',
    'avs': 'https://images.fotmob.com/image_resources/logo/teamlogo/8146.png',
    'psv': 'https://images.fotmob.com/image_resources/logo/teamlogo/8640.png',
    'psv eindhoven': 'https://images.fotmob.com/image_resources/logo/teamlogo/8640.png',
    'feyenoord': 'https://images.fotmob.com/image_resources/logo/teamlogo/10235.png',
    'twente': 'https://images.fotmob.com/image_resources/logo/teamlogo/8611.png',
    'az alkmaar': 'https://images.fotmob.com/image_resources/logo/teamlogo/10229.png',
    'ajax': 'https://images.fotmob.com/image_resources/logo/teamlogo/8593.png',
    'nec nijmegen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8464.png',
    'utrecht': 'https://images.fotmob.com/image_resources/logo/teamlogo/9908.png',
    'sparta rotterdam': 'https://images.fotmob.com/image_resources/logo/teamlogo/8614.png',
    'go ahead eagles': 'https://images.fotmob.com/image_resources/logo/teamlogo/6433.png',
    'fortuna sittard': 'https://images.fotmob.com/image_resources/logo/teamlogo/6413.png',
    'heerenveen': 'https://images.fotmob.com/image_resources/logo/teamlogo/10228.png',
    'pec zwolle': 'https://images.fotmob.com/image_resources/logo/teamlogo/8612.png',
    'zwolle': 'https://images.fotmob.com/image_resources/logo/teamlogo/8612.png',
    'almere city': 'https://images.fotmob.com/image_resources/logo/teamlogo/7787.png',
    'heracles': 'https://images.fotmob.com/image_resources/logo/teamlogo/9791.png',
    'rkc waalwijk': 'https://images.fotmob.com/image_resources/logo/teamlogo/9907.png',
    'willem ii': 'https://images.fotmob.com/image_resources/logo/teamlogo/8526.png',
    'groningen': 'https://images.fotmob.com/image_resources/logo/teamlogo/8674.png',
    'nac breda': 'https://images.fotmob.com/image_resources/logo/teamlogo/9761.png',
    'galatasaray': 'https://images.fotmob.com/image_resources/logo/teamlogo/8637.png',
    'fenerbahce': 'https://images.fotmob.com/image_resources/logo/teamlogo/8695.png',
    'fenerbahçe': 'https://images.fotmob.com/image_resources/logo/teamlogo/8695.png',
    'trabzonspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/9912.png',
    'besiktas': 'https://images.fotmob.com/image_resources/logo/teamlogo/10188.png',
    'beşiktaş': 'https://images.fotmob.com/image_resources/logo/teamlogo/10188.png',
    'başakşehir': 'https://images.fotmob.com/image_resources/logo/teamlogo/8499.png',
    'basaksehir': 'https://images.fotmob.com/image_resources/logo/teamlogo/8499.png',
    'kasimpasa': 'https://images.fotmob.com/image_resources/logo/teamlogo/8496.png',
    'kasımpaşa': 'https://images.fotmob.com/image_resources/logo/teamlogo/8496.png',
    'sivasspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/8497.png',
    'alanyaspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/10200.png',
    'rizespor': 'https://images.fotmob.com/image_resources/logo/teamlogo/9752.png',
    'antalyaspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/8498.png',
    'gaziantep': 'https://images.fotmob.com/image_resources/logo/teamlogo/178474.png',
    'adana demirspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/8500.png',
    'samsunspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/9751.png',
    'kayserispor': 'https://images.fotmob.com/image_resources/logo/teamlogo/9750.png',
    'hatayspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/7791.png',
    'konyaspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/8501.png',
    'goztepe': 'https://images.fotmob.com/image_resources/logo/teamlogo/8495.png',
    'göztepe': 'https://images.fotmob.com/image_resources/logo/teamlogo/8495.png',
    'eyupspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/6548.png',
    'eyüpspor': 'https://images.fotmob.com/image_resources/logo/teamlogo/6548.png',
    'club brugge': 'https://images.fotmob.com/image_resources/logo/teamlogo/8342.png',
    'shakhtar': 'https://images.fotmob.com/image_resources/logo/teamlogo/9842.png',
    'shakhtar donetsk': 'https://images.fotmob.com/image_resources/logo/teamlogo/9842.png',
    'dinamo zagreb': 'https://images.fotmob.com/image_resources/logo/teamlogo/9797.png',
    'red star': 'https://images.fotmob.com/image_resources/logo/teamlogo/9798.png',
    'sparta prague': 'https://images.fotmob.com/image_resources/logo/teamlogo/9796.png',
    'salzburg': 'https://images.fotmob.com/image_resources/logo/teamlogo/9931.png',
    'young boys': 'https://images.fotmob.com/image_resources/logo/teamlogo/10192.png',
    'sturm graz': 'https://images.fotmob.com/image_resources/logo/teamlogo/8167.png',

    // --- NATIONAL TEAMS ---
    'argentina': 'https://flagcdn.com/w40/ar.png',
    'france': 'https://flagcdn.com/w40/fr.png',
    'brazil': 'https://flagcdn.com/w40/br.png',
    'germany': 'https://flagcdn.com/w40/de.png',
    'england': 'https://flagcdn.com/w40/gb-eng.png',
    'spain': 'https://flagcdn.com/w40/es.png',
    'italy': 'https://flagcdn.com/w40/it.png',
    'portugal': 'https://flagcdn.com/w40/pt.png',
    'netherlands': 'https://flagcdn.com/w40/nl.png',
    'belgium': 'https://flagcdn.com/w40/be.png',
    'uruguay': 'https://flagcdn.com/w40/uy.png',
    'croatia': 'https://flagcdn.com/w40/hr.png',
    'denmark': 'https://flagcdn.com/w40/dk.png',
    'switzerland': 'https://flagcdn.com/w40/ch.png',
    'usa': 'https://flagcdn.com/w40/us.png',
    'colombia': 'https://flagcdn.com/w40/co.png',
    'mexico': 'https://flagcdn.com/w40/mx.png',
    'canada': 'https://flagcdn.com/w40/ca.png',
    'chile': 'https://flagcdn.com/w40/cl.png',
    'peru': 'https://flagcdn.com/w40/pe.png',
    'japan': 'https://flagcdn.com/w40/jp.png',
    'australia': 'https://flagcdn.com/w40/au.png',
    'morocco': 'https://flagcdn.com/w40/ma.png',
    'senegal': 'https://flagcdn.com/w40/sn.png',
    'egypt': 'https://flagcdn.com/w40/eg.png',
    'nigeria': 'https://flagcdn.com/w40/ng.png',
    'ecuador': 'https://flagcdn.com/w40/ec.png',
    'venezuela': 'https://flagcdn.com/w40/ve.png',
    'paraguay': 'https://flagcdn.com/w40/py.png',
    'bolivia': 'https://flagcdn.com/w40/bo.png',
    'turkey': 'https://flagcdn.com/w40/tr.png',
    'austria': 'https://flagcdn.com/w40/at.png',
    'poland': 'https://flagcdn.com/w40/pl.png',
    'scotland': 'https://flagcdn.com/w40/gb-sct.png',
    'czechia': 'https://flagcdn.com/w40/cz.png',
    'slovakia': 'https://flagcdn.com/w40/sk.png',
    'romania': 'https://flagcdn.com/w40/ro.png',
    'slovenia': 'https://flagcdn.com/w40/si.png',
    'albania': 'https://flagcdn.com/w40/al.png',
    'georgia': 'https://flagcdn.com/w40/ge.png',
    'ukraine': 'https://flagcdn.com/w40/ua.png',
    'hungary': 'https://flagcdn.com/w40/hu.png',
    'serbia': 'https://flagcdn.com/w40/rs.png',
    'jamaica': 'https://flagcdn.com/w40/jm.png',
    'costa rica': 'https://flagcdn.com/w40/cr.png',
    'panama': 'https://flagcdn.com/w40/pa.png',
    'saudi arabia': 'https://flagcdn.com/w40/sa.png',
    'south korea': 'https://flagcdn.com/w40/kr.png'
  };

  // Master list of 105+ global nations across all 6 FIFA confederations
  const WC_ALL_NATIONS = [
    // UEFA (Europe) — 34 nations
    { name: 'ARGENTINA',    conf: 'CONMEBOL', flag: 'ar', str: 95 },
    { name: 'FRANCE',       conf: 'UEFA',     flag: 'fr', str: 93 },
    { name: 'BRAZIL',       conf: 'CONMEBOL', flag: 'br', str: 94 },
    { name: 'ENGLAND',      conf: 'UEFA',     flag: 'gb-eng', str: 88 },
    { name: 'SPAIN',        conf: 'UEFA',     flag: 'es', str: 90 },
    { name: 'GERMANY',      conf: 'UEFA',     flag: 'de', str: 87 },
    { name: 'PORTUGAL',     conf: 'UEFA',     flag: 'pt', str: 89 },
    { name: 'NETHERLANDS',  conf: 'UEFA',     flag: 'nl', str: 86 },
    { name: 'ITALY',        conf: 'UEFA',     flag: 'it', str: 85 },
    { name: 'BELGIUM',      conf: 'UEFA',     flag: 'be', str: 83 },
    { name: 'CROATIA',      conf: 'UEFA',     flag: 'hr', str: 82 },
    { name: 'DENMARK',      conf: 'UEFA',     flag: 'dk', str: 80 },
    { name: 'SWITZERLAND',  conf: 'UEFA',     flag: 'ch', str: 81 },
    { name: 'AUSTRIA',      conf: 'UEFA',     flag: 'at', str: 79 },
    { name: 'POLAND',       conf: 'UEFA',     flag: 'pl', str: 77 },
    { name: 'TURKEY',       conf: 'UEFA',     flag: 'tr', str: 78 },
    { name: 'UKRAINE',      conf: 'UEFA',     flag: 'ua', str: 76 },
    { name: 'SERBIA',       conf: 'UEFA',     flag: 'rs', str: 75 },
    { name: 'SCOTLAND',     conf: 'UEFA',     flag: 'gb-sct', str: 73 },
    { name: 'CZECHIA',      conf: 'UEFA',     flag: 'cz', str: 74 },
    { name: 'HUNGARY',      conf: 'UEFA',     flag: 'hu', str: 72 },
    { name: 'SLOVAKIA',     conf: 'UEFA',     flag: 'sk', str: 70 },
    { name: 'ROMANIA',      conf: 'UEFA',     flag: 'ro', str: 69 },
    { name: 'NORWAY',       conf: 'UEFA',     flag: 'no', str: 74 },
    { name: 'SWEDEN',       conf: 'UEFA',     flag: 'se', str: 75 },
    { name: 'WALES',        conf: 'UEFA',     flag: 'gb-wls', str: 69 },
    { name: 'SLOVENIA',     conf: 'UEFA',     flag: 'si', str: 67 },
    { name: 'ALBANIA',      conf: 'UEFA',     flag: 'al', str: 64 },
    { name: 'GEORGIA',      conf: 'UEFA',     flag: 'ge', str: 65 },
    { name: 'GREECE',       conf: 'UEFA',     flag: 'gr', str: 71 },
    { name: 'IRELAND',      conf: 'UEFA',     flag: 'ie', str: 68 },
    { name: 'FINLAND',      conf: 'UEFA',     flag: 'fi', str: 66 },
    { name: 'ICELAND',      conf: 'UEFA',     flag: 'is', str: 63 },
    { name: 'BOSNIA',       conf: 'UEFA',     flag: 'ba', str: 66 },

    // CONMEBOL (South America) — 10 nations
    { name: 'URUGUAY',      conf: 'CONMEBOL', flag: 'uy', str: 82 },
    { name: 'COLOMBIA',     conf: 'CONMEBOL', flag: 'co', str: 81 },
    { name: 'ECUADOR',      conf: 'CONMEBOL', flag: 'ec', str: 76 },
    { name: 'CHILE',        conf: 'CONMEBOL', flag: 'cl', str: 74 },
    { name: 'PERU',         conf: 'CONMEBOL', flag: 'pe', str: 72 },
    { name: 'VENEZUELA',    conf: 'CONMEBOL', flag: 've', str: 71 },
    { name: 'PARAGUAY',     conf: 'CONMEBOL', flag: 'py', str: 70 },
    { name: 'BOLIVIA',      conf: 'CONMEBOL', flag: 'bo', str: 62 },

    // CONCACAF (North/Central America) — 13 nations
    { name: 'USA',          conf: 'CONCACAF', flag: 'us', str: 83 },
    { name: 'MEXICO',       conf: 'CONCACAF', flag: 'mx', str: 81 },
    { name: 'CANADA',       conf: 'CONCACAF', flag: 'ca', str: 79 },
    { name: 'JAMAICA',      conf: 'CONCACAF', flag: 'jm', str: 67 },
    { name: 'COSTA RICA',   conf: 'CONCACAF', flag: 'cr', str: 70 },
    { name: 'PANAMA',       conf: 'CONCACAF', flag: 'pa', str: 69 },
    { name: 'HONDURAS',     conf: 'CONCACAF', flag: 'hn', str: 64 },
    { name: 'EL SALVADOR',  conf: 'CONCACAF', flag: 'sv', str: 62 },
    { name: 'HAITI',        conf: 'CONCACAF', flag: 'ht', str: 60 },
    { name: 'TRINIDAD & TOBAGO', conf: 'CONCACAF', flag: 'tt', str: 59 },
    { name: 'GUATEMALA',    conf: 'CONCACAF', flag: 'gt', str: 58 },
    { name: 'CURACAO',      conf: 'CONCACAF', flag: 'cw', str: 57 },
    { name: 'CUBA',         conf: 'CONCACAF', flag: 'cu', str: 55 },

    // CAF (Africa) — 18 nations
    { name: 'MOROCCO',      conf: 'CAF',      flag: 'ma', str: 85 },
    { name: 'SENEGAL',      conf: 'CAF',      flag: 'sn', str: 82 },
    { name: 'NIGERIA',      conf: 'CAF',      flag: 'ng', str: 80 },
    { name: 'EGYPT',        conf: 'CAF',      flag: 'eg', str: 79 },
    { name: 'CAMEROON',     conf: 'CAF',      flag: 'cm', str: 77 },
    { name: 'IVORY COAST',  conf: 'CAF',      flag: 'ci', str: 78 },
    { name: 'GHANA',        conf: 'CAF',      flag: 'gh', str: 75 },
    { name: 'TUNISIA',      conf: 'CAF',      flag: 'tn', str: 74 },
    { name: 'ALGERIA',      conf: 'CAF',      flag: 'dz', str: 76 },
    { name: 'MALI',         conf: 'CAF',      flag: 'ml', str: 70 },
    { name: 'SOUTH AFRICA', conf: 'CAF',      flag: 'za', str: 69 },
    { name: 'DR CONGO',     conf: 'CAF',      flag: 'cd', str: 67 },
    { name: 'BURKINA FASO', conf: 'CAF',      flag: 'bf', str: 68 },
    { name: 'GUINEA',       conf: 'CAF',      flag: 'gn', str: 66 },
    { name: 'CAPE VERDE',   conf: 'CAF',      flag: 'cv', str: 67 },
    { name: 'ZAMBIA',       conf: 'CAF',      flag: 'zm', str: 64 },
    { name: 'ANGOLA',       conf: 'CAF',      flag: 'ao', str: 63 },

    // AFC (Asia) — 17 nations
    { name: 'JAPAN',        conf: 'AFC',      flag: 'jp', str: 84 },
    { name: 'SOUTH KOREA',  conf: 'AFC',      flag: 'kr', str: 82 },
    { name: 'SAUDI ARABIA', conf: 'AFC',      flag: 'sa', str: 76 },
    { name: 'AUSTRALIA',    conf: 'AFC',      flag: 'au', str: 75 },
    { name: 'IRAN',         conf: 'AFC',      flag: 'ir', str: 76 },
    { name: 'QATAR',        conf: 'AFC',      flag: 'qa', str: 71 },
    { name: 'IRAQ',         conf: 'AFC',      flag: 'iq', str: 69 },
    { name: 'UZBEKISTAN',   conf: 'AFC',      flag: 'uz', str: 68 },
    { name: 'JORDAN',       conf: 'AFC',      flag: 'jo', str: 66 },
    { name: 'UAE',          conf: 'AFC',      flag: 'ae', str: 68 },
    { name: 'BAHRAIN',      conf: 'AFC',      flag: 'bh', str: 64 },
    { name: 'OMAN',         conf: 'AFC',      flag: 'om', str: 65 },
    { name: 'CHINA',        conf: 'AFC',      flag: 'cn', str: 66 },
    { name: 'INDONESIA',    conf: 'AFC',      flag: 'id', str: 64 },
    { name: 'THAILAND',     conf: 'AFC',      flag: 'th', str: 63 },
    { name: 'VIETNAM',      conf: 'AFC',      flag: 'vn', str: 62 },
    { name: 'INDIA',        conf: 'AFC',      flag: 'in', str: 60 },

    // OFC (Oceania) — 5 nations
    { name: 'NEW ZEALAND',  conf: 'OFC',      flag: 'nz', str: 64 },
    { name: 'FIJI',         conf: 'OFC',      flag: 'fj', str: 52 },
    { name: 'TAHITI',       conf: 'OFC',      flag: 'pf', str: 48 },
    { name: 'NEW CALEDONIA',conf: 'OFC',      flag: 'nc', str: 50 },
    { name: 'SOLOMON ISLANDS', conf: 'OFC',   flag: 'sb', str: 47 }
  ];

  const TEAM_LOGO_CACHE = {};
  function buildLogoCache() {
    function registerLogo(key, logoUrl) {
      if (!key || !logoUrl) return;
      const raw = key.toLowerCase().trim();
      const norm = raw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const stripped = norm.replace(/[^a-z0-9]/g, '');
      TEAM_LOGO_CACHE[raw] = logoUrl;
      TEAM_LOGO_CACHE[norm] = logoUrl;
      if (stripped) TEAM_LOGO_CACHE[stripped] = logoUrl;
    }

    Object.keys(OFFICIAL_LOGOS).forEach(k => {
      registerLogo(k, OFFICIAL_LOGOS[k]);
    });

    if (typeof WC_ALL_NATIONS !== 'undefined' && Array.isArray(WC_ALL_NATIONS)) {
      WC_ALL_NATIONS.forEach(n => {
        if (n.name && n.flag) {
          registerLogo(n.name, `https://flagcdn.com/w40/${n.flag}.png`);
        }
      });
    }

    if (typeof window !== 'undefined' && window.REAL_TOURNAMENTS_DATA) {
      Object.keys(window.REAL_TOURNAMENTS_DATA).forEach(tKey => {
        const teams = window.REAL_TOURNAMENTS_DATA[tKey]?.teams || [];
        teams.forEach(t => {
          if (t.name && t.logo) {
            registerLogo(t.name, t.logo);
            if (t.code) registerLogo(t.code, t.logo);
          }
        });
      });
    }
  }

  // Pre-build initial cache immediately
  buildLogoCache();

  function getTeamLogoHtml(teamName) {
    if (!teamName) return '';
    const key = teamName.toLowerCase().trim();
    const normKey = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const strippedKey = normKey.replace(/[^a-z0-9]/g, '');

    const logoUrl = TEAM_LOGO_CACHE[key] ||
                    TEAM_LOGO_CACHE[normKey] ||
                    TEAM_LOGO_CACHE[strippedKey] ||
                    OFFICIAL_LOGOS[key] ||
                    OFFICIAL_LOGOS[normKey] ||
                    OFFICIAL_LOGOS[strippedKey];

    if (logoUrl) {
      return `<img src="${logoUrl}" class="team-logo" alt="${teamName}" loading="lazy" onerror="this.outerHTML='<span class=\\'team-logo-emoji\\'>⚽</span>'">`;
    }
    return '<span class="team-logo-emoji">⚽</span>';
  }

  // ---------------------------------------------------------------------------
  // 2. 10 COMPETITIONS CONFIGURATION (WORLD A REAL DATA + WORLD B SIMULATION)
  // ---------------------------------------------------------------------------
  const TOURNAMENTS_CONFIG = {
    wc: {
      key: 'wc',
      name: 'FIFA WORLD CUP 2026',
      desc: 'Simulate 48 global national contenders across 12 groups (A–L), 32-team knockout bracket, and crown the world champion!',
      format: 'worldcup48',
      type: 'cup',
      strengthType: 'national'
    },
    ucl: {
      key: 'ucl',
      name: 'UEFA CHAMPIONS LEAGUE',
      desc: 'Simulate 36 European elite clubs through the new Swiss League Phase, playoff round, and knockout tree to the Wembley Final!',
      format: 'uclLeaguePhase',
      type: 'cup',
      strengthType: 'club'
    },
    pl: {
      key: 'pl',
      name: 'PREMIER LEAGUE',
      desc: 'Simulate the 20-club English top flight across 38 matchdays with true double round-robin scheduling and points race!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    laliga: {
      key: 'laliga',
      name: 'LA LIGA EA SPORTS',
      desc: 'Simulate 20 Spanish clubs, El Clásico derbies, European qualification spots, and the battle for the championship of Spain!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    serieA: {
      key: 'serieA',
      name: 'SERIE A ENILIVE',
      desc: 'Simulate 20 Italian clubs, Milan and Rome derbies, and the historic race for the official Scudetto trophy!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    bundesliga: {
      key: 'bundesliga',
      name: 'BUNDESLIGA',
      desc: 'Simulate 18 German clubs across 34 thrilling matchdays, Meisterschale title race, and European football qualification!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    ligue1: {
      key: 'ligue1',
      name: 'LIGUE 1 MCDONALD’S',
      desc: 'Simulate 18 French clubs across 34 matchdays with true double round-robin scheduling, Le Classique derbies, and European spots!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    ligaPortugal: {
      key: 'ligaPortugal',
      name: 'LIGA PORTUGAL BETCLIC',
      desc: 'Simulate 18 Portuguese clubs across 34 matchdays with O Clássico derbies, European qualification spots, and the title race!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    eredivisie: {
      key: 'eredivisie',
      name: 'EREDIVISIE',
      desc: 'Simulate 18 Dutch clubs across 34 matchdays with De Klassieker derbies and continental UEFA qualification spots!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    superLig: {
      key: 'superLig',
      name: 'TRENDYOL SÜPER LİG',
      desc: 'Simulate 18 Turkish powerhouses through 34 intense matchdays, Istanbul derbies, and the race for European glory!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    scottishPrem: {
      key: 'scottishPrem',
      name: 'SCOTTISH PREMIERSHIP',
      desc: 'Simulate 12 Scottish clubs across the season, legendary Old Firm derbies, and European competition qualification!',
      format: 'leagueSeason',
      type: 'league',
      strengthType: 'club'
    },
    euro: {
      key: 'euro',
      name: 'UEFA EURO',
      desc: 'Simulate 24 European national contenders in 6 groups (A–F), knockout rounds, and crown the champion in Berlin!',
      format: 'euro24',
      type: 'cup',
      strengthType: 'national'
    },
    copa: {
      key: 'copa',
      name: 'COPA AMÉRICA 2024',
      desc: 'Simulate 16 American national contenders in 4 groups (A–D), Miami knockout stages, and crown the champion!',
      format: 'copa16',
      type: 'cup',
      strengthType: 'national'
    }
  };

  // ---------------------------------------------------------------------------
  // 3. HIGHLIGHTS DATASET (VERIFIED COMPETITIONS & REPLAYS)
  // ---------------------------------------------------------------------------
  const HIGHLIGHTS_DATA = [
    {
      id: 'h_wc_1',
      tournamentKey: 'wc',
      title: 'World Cup Final: Argentina vs France',
      competition: 'FIFA World Cup',
      season: '2022 Final',
      date: '2022-12-18',
      isFinal: true,
      duration: '09:45',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      homeTeam: 'ARGENTINA',
      awayTeam: 'FRANCE',
      score: '3 - 3 (4-2 pens)',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      summary: 'Lionel Messi and Kylian Mbappé deliver an all-time classic World Cup final in Lusail.'
    },
    {
      id: 'h_ucl_1',
      tournamentKey: 'ucl',
      title: 'UCL Final: Real Madrid vs Borussia Dortmund',
      competition: 'UEFA Champions League',
      season: '2023/24 Final',
      date: '2024-06-01',
      isFinal: true,
      duration: '08:30',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      homeTeam: 'REAL MADRID',
      awayTeam: 'DORTMUND',
      score: '2 - 0',
      thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      summary: 'Dani Carvajal and Vinícius Júnior clinch Real Madrid’s record 15th European title at Wembley.'
    },
    {
      id: 'h_pl_1',
      tournamentKey: 'pl',
      title: 'Title Decider: Man City vs West Ham',
      competition: 'Premier League',
      season: '2023/24 Matchday 38',
      date: '2024-05-19',
      isFinal: true,
      duration: '06:45',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      homeTeam: 'MAN CITY',
      awayTeam: 'WEST HAM',
      score: '3 - 1',
      thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80',
      summary: 'Phil Foden scores a stunning brace as Manchester City seal their 4th consecutive Premier League title.'
    },
    {
      id: 'h_laliga_1',
      tournamentKey: 'laliga',
      title: 'El Clásico: Real Madrid vs Barcelona',
      competition: 'La Liga',
      season: '2023/24 Season',
      date: '2024-04-21',
      isFinal: true,
      duration: '08:15',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      homeTeam: 'REAL MADRID',
      awayTeam: 'BARCELONA',
      score: '3 - 2',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      summary: 'Jude Bellingham strikes in the 91st minute to cap an unforgettable comeback win at the Santiago Bernabéu.'
    },
    {
      id: 'h_serieA_1',
      tournamentKey: 'serieA',
      title: 'Milan Derby Scudetto Decider: AC Milan vs Inter Milan',
      competition: 'Serie A',
      season: '2023/24 Season',
      date: '2024-04-22',
      isFinal: true,
      duration: '07:45',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      homeTeam: 'AC MILAN',
      awayTeam: 'INTER MILAN',
      score: '1 - 2',
      thumbnail: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=800&q=80',
      summary: 'Inter Milan triumph in the Derby della Madonnina to secure their 20th Scudetto and Second Star.'
    },
    {
      id: 'h_bundesliga_1',
      tournamentKey: 'bundesliga',
      title: 'Title Decider: Bayer Leverkusen vs Werder Bremen',
      competition: 'Bundesliga',
      season: '2023/24 Season',
      date: '2024-04-14',
      isFinal: true,
      duration: '07:20',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoylikes.mp4',
      homeTeam: 'BAYER LEVERKUSEN',
      awayTeam: 'WERDER BREMEN',
      score: '5 - 0',
      thumbnail: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
      summary: 'Xabi Alonso’s Bayer Leverkusen seal their first-ever Bundesliga title with an unbeaten season.'
    },
    {
      id: 'h_euro_1',
      tournamentKey: 'euro',
      title: 'UEFA Euro 2024 Final: Spain vs England',
      competition: 'UEFA Euro',
      season: 'Euro 2024 Final',
      date: '2024-07-14',
      isFinal: true,
      duration: '09:10',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      homeTeam: 'SPAIN',
      awayTeam: 'ENGLAND',
      score: '2 - 1',
      thumbnail: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&w=800&q=80',
      summary: 'Mikel Oyarzabal scores in the 86th minute to crown Spain champions of Europe in Berlin.'
    },
    {
      id: 'h_copa_1',
      tournamentKey: 'copa',
      title: 'Copa América 2024 Final: Argentina vs Colombia',
      competition: 'Copa América',
      season: 'Copa 2024 Final',
      date: '2024-07-14',
      isFinal: true,
      duration: '08:50',
      fallbackVideo: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      homeTeam: 'ARGENTINA',
      awayTeam: 'COLOMBIA',
      score: '1 - 0 (AET)',
      thumbnail: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
      summary: 'Lautaro Martínez scores in the 112th minute in Miami as Argentina retain their Copa América crown.'
    }
  ];

  // ---------------------------------------------------------------------------
  // 4. TOURNAMENT ISOLATED SIMULATION STATE ENGINE & STAR PLAYER ROSTER
  // ---------------------------------------------------------------------------
  let activeTournKey = 'wc';
  let activeStageFilter = 'all';
  const tournamentState = {};
  let wcCustomTeams = null;

  // Global Simulation Timers & Animation Registry
  let activeSimulationTimer = null;
  let activeSimulationInterval = null;
  const activeSingleMatchIntervals = {};

  let activeSimulationClock = {
    isRunning: false,
    isPaused: false,
    currentSimMinute: 0,
    totalSimMinutes: 90,
    realDurationMs: 60000,
    startTime: 0,
    elapsedBeforePause: 0,
    activeMatches: []
  };
  let leagueAutoSimActive = false;

  function cancelAllActiveSimulationTimers() {
    if (activeSimulationTimer) {
      clearTimeout(activeSimulationTimer);
      activeSimulationTimer = null;
    }
    if (activeSimulationInterval) {
      clearInterval(activeSimulationInterval);
      activeSimulationInterval = null;
    }
    Object.keys(activeSingleMatchIntervals).forEach(k => {
      clearInterval(activeSingleMatchIntervals[k]);
      delete activeSingleMatchIntervals[k];
    });

    activeSimulationClock.isRunning = false;
    activeSimulationClock.isPaused = false;
    activeSimulationClock.currentSimMinute = 0;
    activeSimulationClock.activeMatches = [];
    activeSimulationClock.stageKey = null; // Clear stale stageKey so Skip/Restart don't reference old stages

    const minText = document.getElementById('clock-minute-text');
    const progressFill = document.getElementById('clock-progress-fill');
    if (minText) minText.textContent = "0' (KICKOFF)";
    if (progressFill) progressFill.style.width = '0%';

    const clockHud = document.getElementById('sim-clock-hud');
    if (clockHud) clockHud.hidden = true;
    const liveControlBar = document.getElementById('live-control-bar');
    if (liveControlBar) liveControlBar.hidden = true;
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resumeBtn = document.getElementById('sim-resume-btn');
    if (pauseBtn) pauseBtn.hidden = false;
    if (resumeBtn) resumeBtn.hidden = true;
  }

  function samplePoisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    do { k++; p *= Math.random(); } while (p > L);
    return k - 1;
  }

  const TEAM_STAR_PLAYERS = {
    // --- NATIONAL TEAMS (WORLD CUP, EURO 2024, COPA AMÉRICA) ---
    'ARGENTINA': ['L. Messi', 'J. Álvarez', 'L. Martínez', 'A. Di María', 'R. De Paul', 'E. Fernández', 'A. Mac Allister'],
    'FRANCE': ['K. Mbappé', 'A. Griezmann', 'O. Giroud', 'O. Dembélé', 'E. Camavinga', 'A. Tchouaméni', 'R. Kolo Muani', 'M. Thuram'],
    'BRAZIL': ['Vinícius Jr.', 'Rodrygo', 'Neymar Jr.', 'Richarlison', 'Raphinha', 'Casemiro', 'Lucas Paquetá', 'Endrick'],
    'ENGLAND': ['H. Kane', 'J. Bellingham', 'B. Saka', 'P. Foden', 'C. Palmer', 'D. Rice', 'O. Watkins', 'A. Gordon'],
    'GERMANY': ['J. Musiala', 'F. Wirtz', 'K. Havertz', 'L. Sané', 'I. Gündoğan', 'N. Füllkrug', 'J. Kimmich'],
    'PORTUGAL': ['C. Ronaldo', 'Bruno Fernandes', 'Bernardo Silva', 'R. Leão', 'Diogo Jota', 'João Félix', 'Gonçalo Ramos'],
    'SPAIN': ['L. Yamal', 'Á. Morata', 'N. Williams', 'Pedri', 'Rodri', 'D. Olmo', 'Fabián Ruiz'],
    'ITALY': ['F. Chiesa', 'N. Barella', 'G. Scamacca', 'L. Pellegrini', 'D. Frattesi', 'F. Dimarco', 'M. Retegui'],
    'NETHERLANDS': ['C. Gakpo', 'M. Depay', 'X. Simons', 'D. Malen', 'T. Reijnders', 'W. Weghorst', 'J. Frimpong'],
    'CROATIA': ['L. Modrić', 'A. Kramarić', 'M. Kovačić', 'I. Perišić', 'J. Gvardiol', 'M. Pašalić'],
    'BELGIUM': ['K. De Bruyne', 'R. Lukaku', 'J. Doku', 'L. Trossard', 'A. Onana', 'Y. Tielemans'],
    'URUGUAY': ['D. Núñez', 'F. Valverde', 'L. Suárez', 'R. Bentancur', 'M. Araújo', 'F. Pellistri'],
    'JAPAN': ['K. Mitoma', 'T. Kubo', 'R. Doan', 'T. Minamino', 'D. Maeda', 'W. Endo'],
    'MOROCCO': ['H. Ziyech', 'Y. En-Nesyri', 'A. Hakimi', 'A. Ounahi', 'S. Boufal', 'B. Díaz'],
    'USA': ['C. Pulisic', 'T. Weah', 'F. Balogun', 'W. McKennie', 'G. Reyna', 'B. Aaronson'],
    'MEXICO': ['S. Giménez', 'H. Lozano', 'E. Álvarez', 'L. Chávez', 'O. Pineda', 'U. Antuna'],
    'COLOMBIA': ['L. Díaz', 'J. Rodríguez', 'J. Arias', 'R. Borré', 'J. Córdoba', 'R. Rios'],
    'SENEGAL': ['S. Mané', 'N. Jackson', 'I. Sarr', 'K. Diatta', 'P. Gueye'],
    'SOUTH KOREA': ['Son Heung-min', 'Lee Kang-in', 'Hwang Hee-chan', 'Cho Gue-sung'],
    'SWITZERLAND': ['G. Xhaka', 'B. Embolo', 'X. Shaqiri', 'M. Akanji', 'R. Vargas'],
    'DENMARK': ['C. Eriksen', 'R. Højlund', 'J. Wind', 'P. Højbjerg', 'M. Damsgaard'],
    'SERBIA': ['A. Mitrović', 'D. Vlahović', 'D. Tadić', 'S. Milinković-Savić', 'F. Kostić'],
    'TURKEY': ['A. Güler', 'H. Çalhanoğlu', 'K. Aktürkoğlu', 'B. Yılmaz', 'C. Tosun'],
    'AUSTRIA': ['M. Sabitzer', 'M. Arnautović', 'C. Baumgartner', 'K. Laimer', 'P. Wimmer'],
    'UKRAINE': ['A. Dovbyk', 'M. Mudryk', 'V. Tsygankov', 'R. Yaremchuk', 'O. Zinchenko'],
    'POLAND': ['R. Lewandowski', 'P. Zieliński', 'K. Świderski', 'N. Zalewski', 'K. Piątek'],
    'CHILE': ['A. Sánchez', 'E. Vargas', 'B. Brereton', 'A. Vidal', 'D. Osorio'],
    'ECUADOR': ['E. Valencia', 'M. Caicedo', 'K. Rodríguez', 'P. Estupiñán', 'K. Páez'],
    'CANADA': ['J. David', 'A. Davies', 'C. Larin', 'T. Buchanan', 'I. Koné'],
    'NIGERIA': ['V. Osimhen', 'A. Lookman', 'V. Boniface', 'S. Chukwueze', 'A. Iwobi'],
    'GHANA': ['M. Kudus', 'I. Williams', 'J. Ayew', 'T. Partey', 'A. Semenyo'],
    'EGYPT': ['M. Salah', 'Trézéguet', 'Mostafa Mohamed', 'O. Marmoush'],
    'ALGERIA': ['R. Mahrez', 'B. Bounedjah', 'A. Gouiri', 'H. Aouar', 'I. Bennacer'],
    'IVORY COAST': ['S. Haller', 'F. Kessié', 'S. Adingra', 'N. Pépé', 'O. Diakité'],
    'CAMEROON': ['V. Aboubakar', 'B. Mbeumo', 'K. Toko Ekambi', 'A. Zambo Anguissa'],
    'AUSTRALIA': ['M. Duke', 'C. Goodwin', 'J. Irvine', 'M. Boyle', 'K. Baccus'],
    'SAUDI ARABIA': ['S. Al-Dawsari', 'S. Al-Shehri', 'F. Al-Buraikan', 'A. Ghareeb'],
    'IRAN': ['M. Taremi', 'S. Azmoun', 'A. Jahanbakhsh', 'M. Mohebi'],
    'PARAGUAY': ['M. Almirón', 'A. Sanabria', 'J. Enciso', 'R. Sosa', 'D. Gómez'],
    'PERU': ['G. Lapadula', 'P. Guerrero', 'E. Flores', 'P. Quispe'],
    'VENEZUELA': ['S. Rondón', 'Y. Soteldo', 'D. Machís', 'J. Savarino', 'E. Bello'],
    'BOLIVIA': ['R. Vaca', 'C. Algarañaz', 'M. Terceros', 'H. Vaca'],
    'PANAMA': ['E. Bárcenas', 'J. Fajardo', 'I. Díaz', 'C. Blackman'],
    'JAMAICA': ['M. Antonio', 'L. Bailey', 'S. Nicholson', 'D. Gray'],
    'COSTA RICA': ['J. Campbell', 'M. Ugalde', 'A. Contreras', 'J. Vargas'],
    'ALBANIA': ['N. Bajrami', 'A. Broja', 'K. Asllani', 'J. Asani'],
    'GEORGIA': ['K. Kvaratskhelia', 'G. Mikautadze', 'O. Kiteishvili', 'G. Chakvetadze'],
    'SLOVENIA': ['B. Šeško', 'A. Šporar', 'J. Oblak', 'P. Stojanović'],
    'SLOVAKIA': ['L. Haraslín', 'I. Schranz', 'S. Lobotka', 'O. Duda'],
    'ROMANIA': ['R. Marin', 'D. Man', 'N. Stanciu', 'D. Drăguș'],
    'CZECHIA': ['P. Schick', 'T. Souček', 'L. Provod', 'A. Hložek'],
    'CZECH REPUBLIC': ['P. Schick', 'T. Souček', 'L. Provod', 'A. Hložek'],
    'SCOTLAND': ['S. McTominay', 'J. McGinn', 'C. Adams', 'A. Robertson', 'L. Shankland'],
    'HUNGARY': ['D. Szoboszlai', 'B. Varga', 'R. Sallai', 'M. Kerkez'],

    // --- PREMIER LEAGUE ---
    'MAN CITY': ['E. Haaland', 'K. De Bruyne', 'P. Foden', 'Bernardo Silva', 'Rodri', 'J. Doku', 'J. Grealish'],
    'MANCHESTER CITY': ['E. Haaland', 'K. De Bruyne', 'P. Foden', 'Bernardo Silva', 'Rodri', 'J. Doku', 'J. Grealish'],
    'ARSENAL': ['B. Saka', 'K. Havertz', 'M. Ødegaard', 'G. Martinelli', 'D. Rice', 'L. Trossard', 'Gabriel Jesus'],
    'LIVERPOOL': ['M. Salah', 'L. Díaz', 'D. Núñez', 'C. Gakpo', 'D. Szoboszlai', 'Diogo Jota', 'A. Mac Allister'],
    'ASTON VILLA': ['O. Watkins', 'L. Bailey', 'J. McGinn', 'M. Diaby', 'Douglas Luiz', 'Y. Tielemans', 'J. Durán'],
    'TOTTENHAM': ['Son Heung-min', 'Richarlison', 'D. Kulusevski', 'J. Maddison', 'B. Johnson', 'P. Sarr'],
    'CHELSEA': ['C. Palmer', 'N. Jackson', 'R. Sterling', 'M. Mudryk', 'E. Fernández', 'M. Caicedo', 'C. Nkunku'],
    'NEWCASTLE': ['A. Isak', 'A. Gordon', 'Callum Wilson', 'Bruno Guimarães', 'J. Murphy', 'Joelinton'],
    'MAN UNITED': ['Bruno Fernandes', 'R. Højlund', 'A. Garnacho', 'M. Rashford', 'Casemiro', 'Antony', 'Kobbie Mainoo'],
    'MANCHESTER UNITED': ['Bruno Fernandes', 'R. Højlund', 'A. Garnacho', 'M. Rashford', 'Casemiro', 'Antony', 'Kobbie Mainoo'],
    'WEST HAM': ['J. Bowen', 'M. Kudus', 'Lucas Paquetá', 'M. Antonio', 'T. Souček', 'J. Ward-Prowse'],
    'BRIGHTON': ['J. Pedro', 'S. Adingra', 'K. Mitoma', 'D. Welbeck', 'E. Ferguson', 'P. Groß'],
    'BOURNEMOUTH': ['D. Solanke', 'A. Semenyo', 'J. Kluivert', 'M. Tavernier', 'E. Ünal'],
    'CRYSTAL PALACE': ['E. Eze', 'M. Olise', 'J. Mateta', 'J. Ayew', 'A. Wharton'],
    'WOLVES': ['M. Cunha', 'Hwang Hee-chan', 'P. Neto', 'P. Sarabia', 'J. Gomes'],
    'FULHAM': ['Rodrigo Muniz', 'R. Jiménez', 'Willian', 'Alex Iwobi', 'A. Pereira', 'H. Wilson'],
    'EVERTON': ['D. Calvert-Lewin', 'A. Doucouré', 'J. Harrison', 'Dwight McNeil', 'I. Ndiaye'],
    'BRENTFORD': ['I. Toney', 'B. Mbeumo', 'Y. Wissa', 'K. Schade', 'M. Jensen'],
    'NOTTINGHAM FOREST': ['C. Wood', 'T. Awoniyi', 'M. Gibbs-White', 'A. Elanga', 'Callum Hudson-Odoi'],
    'LEICESTER CITY': ['J. Vardy', 'P. Daka', 'S. Mavididi', 'K. Dewsbury-Hall', 'A. Fatawu'],
    'IPSWICH TOWN': ['C. Chaplin', 'G. Hirst', 'N. Broadhead', 'O. Hutchinson', 'L. Davis'],
    'SOUTHAMPTON': ['A. Armstrong', 'C. Adams', 'R. Fraser', 'S. Edozie', 'W. Smallbone'],

    // --- LA LIGA ---
    'REAL MADRID': ['Vinícius Jr.', 'K. Mbappé', 'J. Bellingham', 'Rodrygo', 'L. Modrić', 'F. Valverde', 'Brahim Díaz', 'Arda Güler'],
    'BARCELONA': ['R. Lewandowski', 'L. Yamal', 'Raphinha', 'Pedri', 'Dani Olmo', 'Gavi', 'F. Torres', 'F. de Jong'],
    'GIRONA': ['A. Dovbyk', 'V. Tsygankov', 'Sávio', 'Iván Martín', 'C. Stuani', 'Y. Herrera', 'Portu'],
    'ATLETICO MADRID': ['A. Griezmann', 'J. Álvarez', 'A. Sørloth', 'R. De Paul', 'M. Llorente', 'Á. Correa', 'Koke'],
    'ATHLETIC CLUB': ['Nico Williams', 'Iñaki Williams', 'O. Sancet', 'G. Guruzeta', 'A. Berenguer', 'Dani Vivian'],
    'REAL SOCIEDAD': ['T. Kubo', 'M. Oyarzabal', 'B. Méndez', 'M. Zubimendi', 'A. Barrenetxea', 'U. Sadiq'],
    'REAL BETIS': ['Isco', 'Ayoze Pérez', 'N. Fekir', 'P. Fornals', 'Willian José', 'Vitor Roque'],
    'VILLARREAL': ['G. Moreno', 'Á. Baena', 'Y. Pino', 'Gonçalo Guedes', 'D. Parejo', 'A. Pérez'],
    'VALENCIA': ['H. Duro', 'J. Guerra', 'D. López', 'Pepelu', 'S. Canós', 'R. Yaremchuk'],
    'ALAVES': ['Samu Omorodion', 'Kike García', 'Luis Rioja', 'C. Benavídez', 'A. Guevara'],
    'OSASUNA': ['A. Budimir', 'Moi Gómez', 'Rubén García', 'Raúl García', 'Aimar Oroz'],
    'GETAFE': ['Borja Mayoral', 'Mason Greenwood', 'N. Maksimović', 'J. Mata', 'Óscar Rodríguez'],
    'CELTA VIGO': ['Iago Aspas', 'J. Strand Larsen', 'J. Bamba', 'F. Beltrán', 'W. Swedberg'],
    'SEVILLA': ['Y. En-Nesyri', 'L. Ocampos', 'I. Romero', 'D. Lukebakio', 'Suso', 'Saúl'],
    'MALLORCA': ['V. Muriqi', 'C. Larin', 'Dani Rodríguez', 'Antonio Sánchez', 'A. Prats'],
    'LAS PALMAS': ['Kirian Rodríguez', 'Munir', 'S. Sandro', 'Moleiro', 'Javi Muñoz'],
    'RAYO VALLECANO': ['Á. García', 'R. Falcao', 'I. Palazón', 'R. Nteka', 'S. Camello'],
    'LEGANES': ['D. Raba', 'M. de la Fuente', 'J. Cruz', 'S. Cissé'],
    'VALLADOLID': ['M. Sylla', 'M. André', 'Raúl Moro', 'Kike Pérez'],
    'ESPANYOL': ['Javi Puado', 'M. Braithwaite', 'Pere Milla', 'K. Bare'],

    // --- SERIE A ---
    'INTER': ['L. Martínez', 'M. Thuram', 'N. Barella', 'H. Çalhanoğlu', 'F. Dimarco', 'D. Dumfries', 'M. Taremi'],
    'INTER MILAN': ['L. Martínez', 'M. Thuram', 'N. Barella', 'H. Çalhanoğlu', 'F. Dimarco', 'D. Dumfries', 'M. Taremi'],
    'AC MILAN': ['R. Leão', 'C. Pulisic', 'Á. Morata', 'T. Reijnders', 'T. Hernández', 'S. Chukwueze', 'R. Loftus-Cheek'],
    'JUVENTUS': ['D. Vlahović', 'K. Yildiz', 'T. Koopmeiners', 'D. Luiz', 'F. Conceição', 'N. González', 'M. Locatelli'],
    'ATALANTA': ['G. Scamacca', 'A. Lookman', 'C. De Ketelaere', 'M. Retegui', 'Éderson', 'M. Pašalić'],
    'BOLOGNA': ['J. Zirkzee', 'R. Orsolini', 'L. Ferguson', 'A. Saelemaekers', 'D. Ndoye'],
    'AS ROMA': ['P. Dybala', 'A. Dovbyk', 'M. Soulé', 'L. Pellegrini', 'S. El Shaarawy', 'B. Cristante'],
    'ROMA': ['P. Dybala', 'A. Dovbyk', 'M. Soulé', 'L. Pellegrini', 'S. El Shaarawy', 'B. Cristante'],
    'LAZIO': ['C. Immobile', 'M. Zaccagni', 'T. Castellanos', 'F. Anderson', 'G. Isaksen'],
    'FIORENTINA': ['N. González', 'M. Kean', 'L. Beltrán', 'A. Guðmundsson', 'A. Colpani'],
    'TORINO': ['D. Zapata', 'A. Sanabria', 'N. Vlašić', 'R. Bellanova', 'C. Adams'],
    'NAPOLI': ['K. Kvaratskhelia', 'R. Lukaku', 'V. Osimhen', 'M. Politano', 'G. Raspadori', 'A. McTominay'],
    'GENOA': ['A. Guðmundsson', 'M. Retegui', 'Vitinha', 'R. Malinovskyi'],
    'MONZA': ['M. Đurić', 'A. Colpani', 'D. Maldini', 'M. Pessina'],
    'HELLAS VERONA': ['T. Noslin', 'M. Folorunsho', 'D. Lazović', 'T. Suslov'],
    'LECCE': ['N. Krstović', 'R. Piccoli', 'L. Banda', 'P. Almqvist'],
    'UDINESE': ['L. Lucca', 'F. Thauvin', 'K. Davis', 'L. Samardžić'],
    'CAGLIARI': ['G. Lapadula', 'Z. Luvumbo', 'N. Nández', 'N. Viola'],
    'EMPOLI': ['M. Cancellieri', 'S. Żurkowski', 'F. Caputo', 'E. Gyasi'],
    'PARMA': ['D. Man', 'V. Mihăilă', 'A. Bonny', 'Adrián Bernabé'],
    'COMO': ['A. Belotti', 'P. Cutrone', 'Gabriel Strefezza', 'N. Paz'],
    'VENEZIA': ['J. Pohjanpalo', 'C. Gytkjær', 'G. Busio', 'G. Oristanio'],

    // --- BUNDESLIGA ---
    'BAYER LEVERKUSEN': ['F. Wirtz', 'V. Boniface', 'A. Grimaldo', 'J. Frimpong', 'G. Xhaka', 'P. Schick', 'J. Hofmann'],
    'STUTTGART': ['S. Guirassy', 'D. Undav', 'E. Demirović', 'C. Führich', 'E. Millot'],
    'BAYERN MUNICH': ['H. Kane', 'J. Musiala', 'M. Olise', 'L. Sané', 'S. Gnabry', 'T. Müller', 'K. Coman'],
    'RB LEIPZIG': ['L. Openda', 'B. Šeško', 'X. Simons', 'D. Olmo', 'C. Baumgartner'],
    'LEIPZIG': ['L. Openda', 'B. Šeško', 'X. Simons', 'D. Olmo', 'C. Baumgartner'],
    'DORTMUND': ['N. Füllkrug', 'S. Guirassy', 'J. Brandt', 'D. Malen', 'K. Adeyemi', 'M. Sabitzer', 'J. Sancho'],
    'BORUSSIA DORTMUND': ['N. Füllkrug', 'S. Guirassy', 'J. Brandt', 'D. Malen', 'K. Adeyemi', 'M. Sabitzer', 'J. Sancho'],
    'EINTRACHT FRANKFURT': ['O. Marmoush', 'H. Ekitiké', 'F. Chaïbi', 'M. Götze', 'Junior Dina Ebimbe'],
    'HOFFENHEIM': ['M. Beier', 'A. Kramarić', 'W. Weghorst', 'I. Bebou'],
    'HEIDENHEIM': ['E. Dinkçi', 'T. Kleindienst', 'J. Beste', 'M. Pieringer'],
    'WERDER BREMEN': ['M. Ducksch', 'J. Njinmah', 'M. Weiser', 'L. Bittencourt'],
    'FREIBURG': ['V. Grifo', 'M. Gregoritsch', 'L. Höler', 'R. Dōan'],
    'AUGSBURG': ['E. Demirović', 'P. Tietz', 'A. Maier', 'R. Vargas'],
    'WOLFSBURG': ['J. Wind', 'L. Majer', 'M. Amoura', 'R. Baku'],
    'MAINZ 05': ['J. Burkardt', 'B. Gruda', 'L. Ajorque', 'J. Lee'],
    'BORUSSIA MONCHENGLADBACH': ['A. Pléa', 'R. Hack', 'T. Čvančara', 'F. Honorat'],
    'UNION BERLIN': ['R. Gosens', 'K. Volland', 'B. Hollerbach', 'Y. Vertessen'],
    'BOCHUM': ['K. Stöger', 'P. Hofmann', 'M. Bero', 'T. Asano'],
    'ST PAULI': ['M. Eggestein', 'J. Irvine', 'E. Saad', 'D. Sinani'],
    'HOLSTEIN KIEL': ['S. Machino', 'B. Pichler', 'A. Bernhardsson', 'F. Porath'],

    // --- LIGUE 1 ---
    'PSG': ['O. Dembélé', 'B. Barcola', 'R. Kolo Muani', 'Vitinha', 'Warren Zaïre-Emery', 'Gonçalo Ramos', 'M. Asensio'],
    'PARIS SAINT-GERMAIN': ['O. Dembélé', 'B. Barcola', 'R. Kolo Muani', 'Vitinha', 'Warren Zaïre-Emery', 'Gonçalo Ramos', 'M. Asensio'],
    'MONACO': ['W. Ben Yedder', 'T. Minamino', 'A. Golovin', 'F. Balogun', 'M. Akliouche', 'B. Embolo'],
    'BREST': ['R. Del Castillo', 'M. Camara', 'S. Mounié', 'J. Le Douaron'],
    'LILLE': ['J. David', 'E. Zhegrova', 'B. André', 'R. Cabella', 'T. Santos'],
    'NICE': ['T. Moffi', 'G. Laborde', 'J. Boga', 'K. Thuram', 'E. Guessand'],
    'LYON': ['A. Lacazette', 'G. Mikautadze', 'E. Nuamah', 'M. Fofana', 'R. Cherki', 'C. Tolisso'],
    'LENS': ['E. Wahi', 'F. Sotoca', 'W. Saïd', 'P. Frankowski', 'A. Thomasson'],
    'MARSEILLE': ['P. Aubameyang', 'M. Greenwood', 'I. Sarr', 'A. Harit', 'A. Sanchez', 'E. Wahi'],
    'REIMS': ['Teddy Teuma', 'O. Diakité', 'K. Nakamura', 'J. Ito'],
    'RENNES': ['A. Kalimuendo', 'L. Blas', 'A. Gouiri', 'B. Bourigeaud'],
    'TOULOUSE': ['T. Dallinga', 'F. Magri', 'V. Sierro', 'Y. Gboho'],
    'MONTPELLIER': ['T. Savanier', 'A. Adams', 'M. Al-Taamari', 'A. Nordin'],
    'STRASBOURG': ['E. Emegha', 'H. Diarra', 'K. Gameiro', 'D. Bakwa'],
    'NANTES': ['Mostafa Mohamed', 'M. Simon', 'F. Mollet', 'T. Kadewere'],
    'LE HAVRE': ['M. Bayo', 'N. Alioui', 'A. Ayew', 'Y. Kechta'],
    'ANGERS': ['L. Diony', 'F. El Melali', 'H. Abdelli', 'J. Lepaul'],
    'AUXERRE': ['G. Hein', 'A. Onaiwu', 'Florian Ayé', 'G. Perrin'],
    'SAINT-ÉTIENNE': ['I. Sissoko', 'M. Cardona', 'M. Cafaro', 'Z. Davitashvili'],

    // --- OTHER EUROPEAN GIANTS (PORTUGAL, NETHERLANDS, TURKEY, SCOTLAND) ---
    'BENFICA': ['Á. Di María', 'Rafa Silva', 'Arthur Cabral', 'Orkun Kökçü', 'João Neves', 'Vangelis Pavlidis'],
    'SPORTING CP': ['V. Gyökeres', 'P. Gonçalves', 'Trincão', 'M. Edwards', 'M. Hjulmand', 'G. Catamo'],
    'PORTO': ['Evanilson', 'Galeno', 'Pepê', 'Francisco Conceição', 'Samu Omorodion', 'Nico González'],
    'FC PORTO': ['Evanilson', 'Galeno', 'Pepê', 'Francisco Conceição', 'Samu Omorodion', 'Nico González'],
    'BRAGA': ['Simon Banza', 'Ricardo Horta', 'Bruma', 'Álvaro Djaló', 'Rodrigo Zalazar'],
    'PSV': ['L. de Jong', 'J. Bakayoko', 'G. Til', 'M. Tillman', 'I. Saibari', 'Joey Veerman'],
    'FEYENOORD': ['S. Giménez', 'I. Paixão', 'Q. Timber', 'C. Stengs', 'L. Ueda'],
    'AJAX': ['B. Brobbey', 'S. Bergwijn', 'C. Akpom', 'K. Taylor', 'W. Weghorst'],
    'GALATASARAY': ['M. Icardi', 'V. Osimhen', 'D. Mertens', 'B. Yılmaz', 'K. Aktürkoğlu', 'H. Ziyech'],
    'FENERBAHCE': ['E. Džeko', 'D. Tadić', 'Y. En-Nesyri', 'İ. Kahveci', 'Fred', 'S. Szymański'],
    'BESIKTAS': ['C. Immobile', 'Rafa Silva', 'Semih Kılıçsoy', 'M. Rashica', 'Ernest Muçi'],
    'CELTIC': ['K. Furuhashi', 'M. O\'Riley', 'D. Maeda', 'Reo Hatate', 'N. Kühn', 'A. Idah'],
    'RANGERS': ['J. Tavernier', 'Cyriel Dessers', 'Danilo', 'Todd Cantwell', 'T. Lawrence']
  };

  function getRandomPlayerForTeam(teamName) {
    const key = (teamName || '').trim().toUpperCase();
    let candidateList = null;

    // Direct match
    if (TEAM_STAR_PLAYERS[key] && TEAM_STAR_PLAYERS[key].length > 0) {
      candidateList = [...TEAM_STAR_PLAYERS[key]];
    } else {
      // Normalized lookup (remove special chars/dots)
      const stripped = key.replace(/[^A-Z0-9]/g, '');
      for (const k of Object.keys(TEAM_STAR_PLAYERS)) {
        if (k.replace(/[^A-Z0-9]/g, '') === stripped) {
          candidateList = [...TEAM_STAR_PLAYERS[k]];
          break;
        }
      }
    }

    // Partial search inside team names
    if (!candidateList || candidateList.length === 0) {
      for (const [k, list] of Object.entries(TEAM_STAR_PLAYERS)) {
        if (key.includes(k) || k.includes(key)) {
          candidateList = [...list];
          break;
        }
      }
    }

    if (candidateList && candidateList.length > 0) {
      // Check real tournament top scorers to boost authentic golden boot contenders
      const realScorers = window.REAL_TOURNAMENTS_DATA?.[activeTournKey]?.topScorers || [];
      const weightedPool = [];
      candidateList.forEach(player => {
        const cleanPlayer = player.toLowerCase().replace(/^[a-z]\.\s*/i, '');
        const isOfficialTopScorer = realScorers.some(s => 
          s.name && (s.name.toLowerCase().includes(cleanPlayer) || cleanPlayer.includes(s.name.toLowerCase()))
        );
        // Boost official golden boot candidates so league scoring emerges naturally and realistically
        const weight = isOfficialTopScorer ? 4 : 1;
        for (let w = 0; w < weight; w++) weightedPool.push(player);
      });
      return weightedPool[Math.floor(Math.random() * weightedPool.length)];
    }

    // Check if team exists in window.REAL_TOURNAMENTS_DATA top scorers
    for (const tKey of Object.keys(window.REAL_TOURNAMENTS_DATA || {})) {
      const scorers = window.REAL_TOURNAMENTS_DATA[tKey]?.topScorers || [];
      const matchScorer = scorers.find(s => s.team && (s.team.toUpperCase() === key || key.includes(s.team.toUpperCase())));
      if (matchScorer) return matchScorer.name;
    }

    // Authentic fallback surnames per nation / region
    const defaultSurnames = ['Silva', 'Santos', 'Johnson', 'Smith', 'Müller', 'García', 'Martínez', 'Kovács', 'Popescu', 'Novak', 'Tanaka', 'Kim', 'Ali', 'Diallo', 'Mendoza', 'Rossi', 'Larsson', 'Jensen', 'Nielsen'];
    const initials = ['A.', 'M.', 'J.', 'D.', 'C.', 'K.', 'R.', 'L.', 'S.', 'E.'];
    const init = initials[Math.floor(Math.random() * initials.length)];
    const sur = defaultSurnames[Math.floor(Math.random() * defaultSurnames.length)];
    return `${init} ${sur}`;
  }

  function clamp(value, min, max) { return Math.min(Math.max(value, min), max); }

  function getStrength(teamName, key = activeTournKey) {
    const norm = (teamName || '').toLowerCase().trim();

    function computeFromStandings(entry, totalTeams) {
      if (!entry) return null;
      if (entry.pts !== undefined && entry.mp && entry.mp > 0) {
        const ptsRatio = entry.pts / (entry.mp * 3); // 0.0 to 1.0 based on points earned vs max possible
        const winRate = entry.w / entry.mp; // 0.0 to 1.0 pure win rate
        const gdPerMatch = (entry.gd || 0) / entry.mp; // goal differential per match
        const normalizedGd = clamp((gdPerMatch + 2) / 4, 0, 1);
        const strength = ptsRatio * 0.5 + winRate * 0.3 + normalizedGd * 0.2;
        return clamp(0.30 + strength * 0.70, 0.30, 1.0);
      }
      if (entry.pos && totalTeams) {
        return clamp(1 - ((entry.pos - 1) / Math.max(totalTeams - 1, 1)) * 0.65, 0.35, 1.0);
      }
      return null;
    }

    // 1. Check in active tournament real standings & team list
    if (key && window.REAL_TOURNAMENTS_DATA?.[key]) {
      const data = window.REAL_TOURNAMENTS_DATA[key];
      if (data.standings && Array.isArray(data.standings)) {
        const entry = data.standings.find(s => (s.club || '').toLowerCase().trim() === norm);
        if (entry) {
          const s = computeFromStandings(entry, data.standings.length);
          if (s !== null) return s;
        }
      }
      if (data.teams && Array.isArray(data.teams)) {
        const idx = data.teams.findIndex(t => (t.name || '').toLowerCase().trim() === norm);
        if (idx !== -1) {
          return clamp(1 - (idx / Math.max(data.teams.length - 1, 1)) * 0.65, 0.35, 1.0);
        }
      }
    }

    // 2. Search all tournaments to find the team's standing or ranking
    for (const tKey of Object.keys(window.REAL_TOURNAMENTS_DATA || {})) {
      const data = window.REAL_TOURNAMENTS_DATA[tKey];
      if (data.standings && Array.isArray(data.standings)) {
        const entry = data.standings.find(s => (s.club || '').toLowerCase().trim() === norm);
        if (entry) {
          const s = computeFromStandings(entry, data.standings.length);
          if (s !== null) return s;
        }
      }
      if (data.teams && Array.isArray(data.teams)) {
        const idx = data.teams.findIndex(t => (t.name || '').toLowerCase().trim() === norm);
        if (idx !== -1) {
          return clamp(1 - (idx / Math.max(data.teams.length - 1, 1)) * 0.65, 0.35, 1.0);
        }
      }
    }
    return 0.75;
  }

  function expectedGoals(teamStrength, oppStrength, isHome) {
    const ratio = (0.6 + teamStrength) / (0.6 + oppStrength);
    const homeAdvantage = isHome ? 1.15 : 0.90;
    const lambda = 1.35 * ratio * homeAdvantage;
    return clamp(lambda, 0.25, 4.0);
  }

  // Precomputes full match outcome with 2nd-half weighted goal minutes, authentic player scorers, extra time, and penalties
  function precomputeMatchResult(homeTeam, awayTeam, isKnockout = true) {
    const hs = getStrength(homeTeam);
    const as = getStrength(awayTeam);
    const lambdaHome = expectedGoals(hs, as, true);
    const lambdaAway = expectedGoals(as, hs, false);

    let scoreHome = Math.min(8, samplePoisson(lambdaHome));
    let scoreAway = Math.min(8, samplePoisson(lambdaAway));

    const events = [];

    // Generate goal minutes weighted toward the second half with authentic player names
    for (let i = 0; i < scoreHome; i++) {
      const min = Math.random() < 0.65 ? Math.floor(46 + Math.random() * 44) : Math.floor(5 + Math.random() * 40);
      const player = getRandomPlayerForTeam(homeTeam);
      events.push({ minute: min, team: 'home', teamName: homeTeam, player, type: 'GOAL' });
    }
    for (let i = 0; i < scoreAway; i++) {
      const min = Math.random() < 0.65 ? Math.floor(46 + Math.random() * 44) : Math.floor(5 + Math.random() * 40);
      const player = getRandomPlayerForTeam(awayTeam);
      events.push({ minute: min, team: 'away', teamName: awayTeam, player, type: 'GOAL' });
    }
    events.sort((a, b) => a.minute - b.minute);

    let hadExtraTime = false;
    let scoreHomeET = scoreHome;
    let scoreAwayET = scoreAway;
    let hadPenalties = false;
    let penHome = 0;
    let penAway = 0;
    let winner = null;
    let penaltiesList = null;

    if (scoreHome > scoreAway) {
      winner = homeTeam;
    } else if (scoreAway > scoreHome) {
      winner = awayTeam;
    } else if (isKnockout) {
      // Extra Time (30 min)
      hadExtraTime = true;
      const etHomeGoals = Math.random() < 0.35 ? 1 : 0;
      const etAwayGoals = Math.random() < 0.35 ? 1 : 0;
      scoreHomeET += etHomeGoals;
      scoreAwayET += etAwayGoals;

      if (etHomeGoals > 0) {
        events.push({ minute: 104 + Math.floor(Math.random() * 15), team: 'home', teamName: homeTeam, player: getRandomPlayerForTeam(homeTeam), type: 'GOAL (ET)' });
      }
      if (etAwayGoals > 0) {
        events.push({ minute: 106 + Math.floor(Math.random() * 14), team: 'away', teamName: awayTeam, player: getRandomPlayerForTeam(awayTeam), type: 'GOAL (ET)' });
      }
      events.sort((a, b) => a.minute - b.minute);

      if (scoreHomeET > scoreAwayET) {
        winner = homeTeam;
      } else if (scoreAwayET > scoreHomeET) {
        winner = awayTeam;
      } else {
        // Penalty Shootout (78% success rate, alternating kicks)
        hadPenalties = true;
        penHome = 0; penAway = 0;
        const homeKicks = [];
        const awayKicks = [];

        for (let round = 1; round <= 5; round++) {
          const hScored = Math.random() < 0.78;
          const aScored = Math.random() < 0.78;
          if (hScored) penHome++;
          if (aScored) penAway++;
          homeKicks.push({ player: getRandomPlayerForTeam(homeTeam), scored: hScored });
          awayKicks.push({ player: getRandomPlayerForTeam(awayTeam), scored: aScored });
        }
        while (penHome === penAway) {
          const hScored = Math.random() < 0.75;
          const aScored = Math.random() < 0.75;
          if (hScored) penHome++;
          if (aScored) penAway++;
          homeKicks.push({ player: getRandomPlayerForTeam(homeTeam), scored: hScored });
          awayKicks.push({ player: getRandomPlayerForTeam(awayTeam), scored: aScored });
        }
        winner = penHome > penAway ? homeTeam : awayTeam;
        penaltiesList = { homeKicks, awayKicks };
      }
    }

    return {
      home: homeTeam,
      away: awayTeam,
      scoreHome: scoreHomeET,
      scoreAway: scoreAwayET,
      regHome: scoreHome,
      regAway: scoreAway,
      hadExtraTime,
      hadPenalties,
      penHome,
      penAway,
      penaltiesList,
      events,
      winner,
      isSimulated: false,
      isLive: false,
      currentDisplayScoreHome: 0,
      currentDisplayScoreAway: 0
    };
  }

  // Round-Robin Matchday Generator with Realistic Multi-Day Time Slots
  function generateLeagueMatchdays(teamNames, realDataTeams) {
    const n = teamNames.length;
    if (n < 2) return [];
    const numRounds = (n - 1) * 2;
    const matchesPerRound = Math.floor(n / 2);

    const teams = [...teamNames];
    const firstHalfRounds = [];

    for (let r = 0; r < n - 1; r++) {
      const roundMatches = [];
      for (let m = 0; m < matchesPerRound; m++) {
        let homeIdx = (r + m) % (n - 1);
        let awayIdx = (n - 1 - m + r) % (n - 1);
        if (m === 0) awayIdx = n - 1;

        const home = (r % 2 === 0) ? teams[homeIdx] : teams[awayIdx];
        const away = (r % 2 === 0) ? teams[awayIdx] : teams[homeIdx];

        roundMatches.push({ home, away });
      }
      firstHalfRounds.push(roundMatches);
    }

    const allRounds = [...firstHalfRounds];
    for (let r = 0; r < n - 1; r++) {
      const reversed = firstHalfRounds[r].map(m => ({ home: m.away, away: m.home }));
      allRounds.push(reversed);
    }

    const scheduleSlots = [
      { day: 'Friday', time: '21:00 CET', label: 'Friday Night Opener' },
      { day: 'Saturday', time: '14:00 CET', label: 'Saturday Afternoon' },
      { day: 'Saturday', time: '16:15 CET', label: 'Saturday Afternoon' },
      { day: 'Saturday', time: '18:30 CET', label: 'Saturday Twilight' },
      { day: 'Saturday', time: '21:00 CET', label: 'Saturday Primetime' },
      { day: 'Sunday', time: '14:00 CET', label: 'Sunday Midday' },
      { day: 'Sunday', time: '16:15 CET', label: 'Sunday Afternoon' },
      { day: 'Sunday', time: '18:30 CET', label: 'Sunday Evening' },
      { day: 'Sunday', time: '21:00 CET', label: 'Sunday Primetime Clash' },
      { day: 'Monday', time: '21:00 CET', label: 'Monday Night Football' }
    ];

    return allRounds.map((matches, rIdx) => {
      return matches.map((m, mIdx) => {
        const slot = scheduleSlots[mIdx % scheduleSlots.length];
        const homeInfo = (realDataTeams || []).find(t => t.name.toUpperCase() === m.home.toUpperCase());
        return {
          id: `md_${rIdx + 1}_${mIdx + 1}`,
          matchday: rIdx + 1,
          home: m.home,
          away: m.away,
          stadium: homeInfo?.stadium || `${m.home} Stadium`,
          city: homeInfo?.city || 'Spain',
          day: slot.day,
          time: slot.time,
          slotLabel: slot.label,
          scoreHome: null,
          scoreAway: null,
          isSimulated: false,
          isLive: false,
          currentSimMinute: 0,
          currentDisplayScoreHome: 0,
          currentDisplayScoreAway: 0,
          events: []
        };
      });
    });
  }

  // ---------------------------------------------------------------------------
  // 5. TOURNAMENT STATE INITIALIZATION
  // ---------------------------------------------------------------------------
  function initTournamentState(key) {
    const config = TOURNAMENTS_CONFIG[key];
    const realData = window.REAL_TOURNAMENTS_DATA?.[key];
    const teamList = (realData?.teams || []).map(t => t.name);

    // Load saved state from localStorage
    let savedState = null;
    try { savedState = JSON.parse(localStorage.getItem('arena_tournament_state_' + key)); } catch (e) {}

    // Initialize state based on saved data or fresh draw
    let state;
    if (savedState && savedState.subView) {
      // Merge saved state with default structure for this format
      const defaults = { groupsPlayed: false, champion: null, subView: 'home', groups: {}, r32: [], r16: [], qf: [], sf: [], gf: [] };
      state = { ...defaults, ...savedState };
      // Ensure groups exist and have proper shape
      if (!state.groups) state.groups = {};
      // If we have saved state, skip fresh initialization
      tournamentState[key] = state;
      // Save the preserved state to localStorage
      try { localStorage.setItem('arena_tournament_state_' + key, JSON.stringify(state)); } catch (e) {}
      return;
    }

    // Fresh initialization based on tournament format
    if (config.format === 'worldcup48') {
      // Use custom draw teams if set, otherwise fall back to real data pool (random draw)
      let pool;
      if (wcCustomTeams && wcCustomTeams.length === 48) {
        pool = [...wcCustomTeams].map(t => t.toUpperCase().trim()).sort(() => Math.random() - 0.5);
      } else {
        pool = [...teamList].map(t => t.toUpperCase().trim()).sort(() => Math.random() - 0.5);
        // Pad or trim to exactly 48 so group draw always works
        while (pool.length < 48) pool.push(`Nation ${pool.length + 1}`);
        pool = pool.slice(0, 48);
      }
      const groups = {};
      const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      groupLetters.forEach((letter, idx) => {
        groups[letter] = pool.slice(idx * 4, idx * 4 + 4).map(name => ({
          name, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
        }));
      });
      state = {
        groupsPlayed: false,
        champion: null,
        subView: 'home',
        groups,
        r32: [], r16: [], qf: [], sf: [], gf: []
      };
    } else if (config.format === 'uclLeaguePhase') {
      const pool = [...teamList];
      const groups = {};
      const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
      groupLetters.forEach((letter, idx) => {
        groups[letter] = pool.slice(idx * 4, idx * 4 + 4).map(name => ({
          name, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
        }));
      });
      state = {
        groupsPlayed: false,
        champion: null,
        subView: 'home',
        groups,
        r16: [], qf: [], sf: [], gf: []
      };
    } else if (config.format === 'euro24') {
      const pool = [...teamList].sort(() => Math.random() - 0.5);
      const groups = {};
      const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
      groupLetters.forEach((letter, idx) => {
        groups[letter] = pool.slice(idx * 4, idx * 4 + 4).map(name => ({
          name, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
        }));
      });
      state = {
        groupsPlayed: false,
        champion: null,
        groups,
        r32: [], r16: [], qf: [], sf: [], gf: []
      };
    } else {
      // 20-Team or 18-Team League Season (PL, La Liga, Serie A, Bundesliga)
      const clubs = teamList;
      const totalRounds = (clubs.length - 1) * 2;
      const leagueTable = clubs.map((name, idx) => ({
        pos: idx + 1,
        club: name,
        mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
      }));
      const matchdays = generateLeagueMatchdays(clubs, realData?.teams);
      state = {
        currentMatchday: 0,
        selectedMatchday: 0,
        subView: 'home',
        totalMatchdays: totalRounds,
        champion: null,
        leagueTable,
        matchdays,
        clubs
      };
    }

    // Save initialized state to localStorage for persistence across page reloads
    try { localStorage.setItem('arena_tournament_state_' + key, JSON.stringify(state)); } catch (e) {}

    tournamentState[key] = state;
  }

  // Initialize isolated states for all 10 competitions
  Object.keys(TOURNAMENTS_CONFIG).forEach(k => initTournamentState(k));

  // ---------------------------------------------------------------------------
  // 6. UI VIEW SWITCHING & NAVIGATION
  // ---------------------------------------------------------------------------
  function syncPrimaryNavState(targetViewId) {
    document.querySelectorAll('.side-item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.target === targetViewId);
    });
    document.querySelectorAll('.top-nav-link').forEach(link => {
      link.classList.toggle('active', link.dataset.nav === targetViewId);
    });
  }

  function switchView(targetViewId) {
    if (targetViewId === 'tactical-tracker') {
      const state = tournamentState[activeTournKey];
      const match = (state?.gf?.[0]) || (state?.sf?.[0]) || (state?.r16?.[0]) || (state?.groupMatches?.[0]) || (state?.matchdays?.[0]?.[0]);
      const hTeam = match?.home || (activeTournKey === 'wc' ? 'ARGENTINA' : 'REAL MADRID');
      const aTeam = match?.away || (activeTournKey === 'wc' ? 'FRANCE' : 'MAN CITY');
      openProTacticalTracker(hTeam, aTeam, match);
      return;
    }

    // Make the tournament-sim panel visible for home/sim views
    const simPanel = document.getElementById('view-tournament-sim');
    const standingsPanel = document.getElementById('view-standings-view');

    if (targetViewId === 'standings-view') {
      if (simPanel) { simPanel.hidden = true; simPanel.classList.remove('active'); }
      if (standingsPanel) { standingsPanel.hidden = false; standingsPanel.classList.add('active'); }
      renderRealStandings();
    } else {
      if (standingsPanel) { standingsPanel.hidden = true; standingsPanel.classList.remove('active'); }
      if (simPanel) { simPanel.hidden = false; simPanel.classList.add('active'); }
    }

    if (targetViewId === 'tournament-home') {
      // Set subView to 'home' so league landing pages show
      if (activeTournKey && tournamentState[activeTournKey]) {
        tournamentState[activeTournKey].subView = 'home';
      }
      leagueAutoSimActive = false;
      cancelAllActiveSimulationTimers();
      renderActiveTournament();
    } else if (targetViewId === 'tournament-sim') {
      // Set subView to 'sim' so simulator controls show
      if (activeTournKey && tournamentState[activeTournKey]) {
        tournamentState[activeTournKey].subView = 'sim';
      }
      renderActiveTournament();
    }

    // Animate data badge transitions
    const dataBadgeLine = document.querySelector('.data-badge-line');
    if (dataBadgeLine) {
      dataBadgeLine.classList.add('badge-animate-out');
      setTimeout(() => {
        dataBadgeLine.classList.remove('badge-animate-out');
        dataBadgeLine.classList.add('badge-animate-in');
      }, 300);
    }

    syncPrimaryNavState(targetViewId);
  }

function setupNavigation() {
    // Scroll chevrons & indicator for competition selector bar
    const compInner = document.getElementById('comp-bar-inner');
    const compLeft = document.getElementById('comp-nav-left');
    const compRight = document.getElementById('comp-nav-right');

    function updateCompNavArrows() {
      if (!compInner) return;
      const atStart = compInner.scrollLeft <= 4;
      const atEnd = compInner.scrollLeft + compInner.clientWidth >= compInner.scrollWidth - 4;
      if (compLeft) {
        compLeft.disabled = atStart;
        compLeft.classList.toggle('disabled', atStart);
      }
      if (compRight) {
        compRight.disabled = atEnd;
        compRight.classList.toggle('disabled', atEnd);
      }
    }

    if (compLeft && compInner) {
      compLeft.addEventListener('click', () => {
        compInner.scrollBy({ left: -260, behavior: 'smooth' });
        setTimeout(updateCompNavArrows, 320);
      });
    }

    if (compRight && compInner) {
      compRight.addEventListener('click', () => {
        compInner.scrollBy({ left: 260, behavior: 'smooth' });
        setTimeout(updateCompNavArrows, 320);
      });
    }

    if (compInner) {
      compInner.addEventListener('scroll', updateCompNavArrows, { passive: true });
      window.addEventListener('resize', updateCompNavArrows);
      setTimeout(updateCompNavArrows, 150);
    }

    document.querySelectorAll('.side-item').forEach(btn => {
      btn.addEventListener('click', () => { if (btn.dataset.target) switchView(btn.dataset.target); });
    });
    document.querySelectorAll('.top-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (link.dataset.nav) switchView(link.dataset.nav);
      });
    });

    // Keyboard navigation shortcuts
    document.addEventListener('keydown', (e) => {
      // Escape key: close modals
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.modal:not([hidden])');
        if (modals.length > 0) {
          modals.forEach(m => { m.hidden = true; });
          document.getElementById('modal-backdrop').hidden = true;
          document.getElementById('champion-modal').hidden = true;
        }
      }

      // Number keys: switch tournaments (wc=1, euro=2, copa=3, ucl=4, pl=5, laliga=6, serieA=7, bundesliga=8, ligue1=9)
      if (e.key >= '1' && e.key <= '9') {
        const tournamentKeys = ['wc', 'euro', 'copa', 'ucl', 'pl', 'laliga', 'serieA', 'bundesliga', 'ligue1'];
        const keyIndex = parseInt(e.key, 10) - 1;
        if (tournamentKeys[keyIndex]) {
          e.preventDefault();
          selectTournament(tournamentKeys[keyIndex]);
        }
      }

      // Arrow keys: navigate stages (right=next, left=prev)
      if (e.key === 'ArrowRight') {
        const activeStageBtn = document.querySelector('#sim-stage-action-btn:not([disabled])');
        if (activeStageBtn && activeStageBtn.textContent.includes('SIMULATE')) {
          e.preventDefault();
          activeStageBtn.click();
        }
      }

      // Space key: toggle play/pause simulation
      if (e.key === ' ') {
        e.preventDefault();
        const pauseBtn = document.getElementById('sim-pause-btn');
        const resumeBtn = document.getElementById('sim-resume-btn');
        if (pauseBtn && !pauseBtn.hidden) {
          pauseBtn.click();
        } else if (resumeBtn && !resumeBtn.hidden) {
          resumeBtn.click();
        }
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 7. TOURNAMENT SELECTION & RENDER PIPELINE
  // ---------------------------------------------------------------------------
  function selectTournament(key) {
    if (!TOURNAMENTS_CONFIG[key]) return;
    cancelAllActiveSimulationTimers();

    // Check if the simulator tab is currently selected in top nav or if previously in sim subview
    const isSimNavActive = document.querySelector('.top-nav-link[data-nav="tournament-sim"]')?.classList.contains('active') ||
                           document.querySelector('.side-item[data-target="tournament-sim"]')?.classList.contains('active') ||
                           tournamentState[activeTournKey]?.subView === 'sim';

    activeTournKey = key;
    activeStageFilter = 'all';

    document.documentElement.setAttribute('data-theme', activeTournKey);
    document.body.setAttribute('data-theme', activeTournKey);

    // Update competition tabs in header & auto-scroll active tab into view
    const compInner = document.getElementById('comp-bar-inner');
    document.querySelectorAll('.comp-tab').forEach(t => {
      const isMatch = t.dataset.tourn === activeTournKey;
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', String(isMatch));
      if (isMatch && compInner && typeof t.scrollIntoView === 'function') {
        t.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
      }
    });

    // Initialize/reset tournament state for fresh simulation
    initTournamentState(activeTournKey);

    // If user was viewing simulator, maintain simulator subview for immediate simulation
    if (isSimNavActive && tournamentState[activeTournKey]) {
      tournamentState[activeTournKey].subView = 'sim';
    }

    renderActiveTournament();
  }

  function renderActiveTournament() {
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    const realData = window.REAL_TOURNAMENTS_DATA?.[activeTournKey];
    const state = tournamentState[activeTournKey];

    document.documentElement.setAttribute('data-theme', activeTournKey);
    document.body.setAttribute('data-theme', activeTournKey);

    const titleEl = document.getElementById('active-tourn-title');
    const descEl = document.getElementById('active-tourn-desc');
    const seasonBadge = document.getElementById('hero-season-badge');
    const sidebarName = document.getElementById('sidebar-comp-name');
    const sidebarFormat = document.getElementById('sidebar-comp-format');
    const sidebarSeason = document.getElementById('sidebar-api-season-badge');
    const champBanner = document.getElementById('champion-banner');
    const champName = document.getElementById('champion-team-name');
    const stageActionBtn = document.getElementById('sim-stage-action-btn');
    const simPanel = document.getElementById('view-tournament-sim');

    if (simPanel && !simPanel.hidden) {
      syncPrimaryNavState(state.subView === 'sim' ? 'tournament-sim' : 'tournament-home');
    }

    if (titleEl) titleEl.textContent = config.name;
    if (descEl) descEl.textContent = config.desc;
    if (seasonBadge && realData) seasonBadge.textContent = `API SEASON: ${realData.actualSeason}`;
    if (sidebarName) sidebarName.textContent = config.name;
    if (sidebarSeason && realData) sidebarSeason.textContent = `SEASON: ${realData.actualSeason} REAL DATA`;

    if (sidebarFormat) {
      if (config.format === 'worldcup48') sidebarFormat.textContent = '48 TEAMS • 12 GROUPS & KNOCKOUTS';
      else if (config.format === 'uclLeaguePhase') sidebarFormat.textContent = '36 TEAMS • SWISS LEAGUE & PLAYOFFS';
      else if (config.format === 'leagueSeason') sidebarFormat.textContent = `${state.clubs?.length || 20} TEAMS • ${state.totalMatchdays} MATCHDAYS`;
      else if (config.format === 'euro24') sidebarFormat.textContent = '24 TEAMS • 6 GROUPS & KNOCKOUTS';
      else sidebarFormat.textContent = '16 TEAMS • 4 GROUPS & KNOCKOUTS';
    }

    if (champBanner) {
      if (state.champion) {
        champBanner.hidden = false;
        if (champName) champName.innerHTML = `${getTeamLogoHtml(state.champion)} ${state.champion}`;
      } else {
        champBanner.hidden = true;
      }
    }

    // Adapt Stage Action Button text
    if (stageActionBtn) {
      if (config.format === 'leagueSeason') {
        const pendingMd = getFirstPendingMatchdayIdx(state);
        stageActionBtn.textContent = pendingMd >= state.totalMatchdays
          ? '🏆 SEASON DONE'
          : `⚡ MATCHDAY ${pendingMd + 1}`;
        stageActionBtn.disabled = pendingMd >= state.totalMatchdays;
      } else if (state.groups && !state.groupsPlayed) {
        stageActionBtn.textContent = '⚡ SIMULATE GROUP STAGE';
        stageActionBtn.disabled = false;
      } else if (state.r32 && state.r32.length > 0 && state.r32.some(m => !m.isSimulated)) {
        stageActionBtn.textContent = '⚡ SIMULATE ROUND OF 32';
        stageActionBtn.disabled = false;
      } else if (state.r16 && state.r16.length > 0 && state.r16.some(m => !m.isSimulated)) {
        stageActionBtn.textContent = '⚡ SIMULATE ROUND OF 16';
        stageActionBtn.disabled = false;
      } else if (state.qf && state.qf.length > 0 && state.qf.some(m => !m.isSimulated)) {
        stageActionBtn.textContent = '⚡ SIMULATE QUARTERFINALS';
        stageActionBtn.disabled = false;
      } else if (state.sf && state.sf.length > 0 && state.sf.some(m => !m.isSimulated)) {
        stageActionBtn.textContent = '⚡ SIMULATE SEMIFINALS';
        stageActionBtn.disabled = false;
      } else if (state.gf && state.gf.length > 0 && !state.champion) {
        stageActionBtn.textContent = '⚡ SIMULATE GRAND FINAL';
        stageActionBtn.disabled = false;
      } else {
        stageActionBtn.textContent = '🏆 TOURNAMENT COMPLETED';
        stageActionBtn.disabled = true;
      }
    }

    const simHeaderCard = document.querySelector('.sim-header-card');
    const stageTabsWrap = document.querySelector('.bracket-nav-tabs');
    const isHomeSubView = state.subView !== 'sim';
    const hasDedicatedHomePage = ['wc', 'ucl', 'euro', 'copa', 'pl', 'laliga', 'serieA', 'bundesliga', 'ligue1', 'ligaPortugal', 'eredivisie', 'superLig', 'scottishPrem'].includes(activeTournKey);

    if (isHomeSubView && hasDedicatedHomePage) {
      if (simHeaderCard) simHeaderCard.hidden = true;
      if (stageTabsWrap) stageTabsWrap.hidden = true;
    } else {
      if (simHeaderCard) simHeaderCard.hidden = false;
      if (stageTabsWrap) stageTabsWrap.hidden = false;
    }

    // World Cup Simulator Back-Bar
    const wcBackBar = document.getElementById('wc-sim-back-bar');
    if (wcBackBar) {
      if (activeTournKey === 'wc' && state.subView === 'sim') {
        wcBackBar.hidden = false;
        const wcBackBtn = document.getElementById('btn-back-to-wc-home');
        if (wcBackBtn) {
          wcBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        wcBackBar.hidden = true;
      }
    }

    // UEFA Champions League Simulator Back-Bar
    const uclBackBar = document.getElementById('ucl-sim-back-bar');
    if (uclBackBar) {
      if (activeTournKey === 'ucl' && state.subView === 'sim') {
        uclBackBar.hidden = false;
        const uclBackBtn = document.getElementById('btn-back-to-ucl-home');
        if (uclBackBtn) {
          uclBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        uclBackBar.hidden = true;
      }
    }

    // UEFA EURO Simulator Back-Bar
    const euroBackBar = document.getElementById('euro-sim-back-bar');
    if (euroBackBar) {
      if (activeTournKey === 'euro' && state.subView === 'sim') {
        euroBackBar.hidden = false;
        const euroBackBtn = document.getElementById('btn-back-to-euro-home');
        if (euroBackBtn) {
          euroBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        euroBackBar.hidden = true;
      }
    }

    // Copa América Simulator Back-Bar
    const copaBackBar = document.getElementById('copa-sim-back-bar');
    if (copaBackBar) {
      if (activeTournKey === 'copa' && state.subView === 'sim') {
        copaBackBar.hidden = false;
        const copaBackBtn = document.getElementById('btn-back-to-copa-home');
        if (copaBackBtn) {
          copaBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        copaBackBar.hidden = true;
      }
    }

    // Premier League Simulator Back-Bar
    const plBackBar = document.getElementById('pl-sim-back-bar');
    if (plBackBar) {
      if (activeTournKey === 'pl' && state.subView === 'sim') {
        plBackBar.hidden = false;
        const plBackBtn = document.getElementById('btn-back-to-pl-home');
        if (plBackBtn) {
          plBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        plBackBar.hidden = true;
      }
    }

    // Serie A Simulator Back-Bar
    const saBackBar = document.getElementById('seriea-sim-back-bar');
    if (saBackBar) {
      if (activeTournKey === 'serieA' && state.subView === 'sim') {
        saBackBar.hidden = false;
        const saBackBtn = document.getElementById('btn-back-to-seriea-home');
        if (saBackBtn) {
          saBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        saBackBar.hidden = true;
      }
    }

    // Bundesliga Simulator Back-Bar
    const blBackBar = document.getElementById('bundesliga-sim-back-bar');
    if (blBackBar) {
      if (activeTournKey === 'bundesliga' && state.subView === 'sim') {
        blBackBar.hidden = false;
        const blBackBtn = document.getElementById('btn-back-to-bundesliga-home');
        if (blBackBtn) {
          blBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        blBackBar.hidden = true;
      }
    }

    // Ligue 1 Simulator Back-Bar
    const l1BackBar = document.getElementById('ligue1-sim-back-bar');
    if (l1BackBar) {
      if (activeTournKey === 'ligue1' && state.subView === 'sim') {
        l1BackBar.hidden = false;
        const l1BackBtn = document.getElementById('btn-back-to-ligue1-home');
        if (l1BackBtn) {
          l1BackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        l1BackBar.hidden = true;
      }
    }

    // Liga Portugal Simulator Back-Bar
    const lpBackBar = document.getElementById('ligaportugal-sim-back-bar');
    if (lpBackBar) {
      if (activeTournKey === 'ligaPortugal' && state.subView === 'sim') {
        lpBackBar.hidden = false;
        const lpBackBtn = document.getElementById('btn-back-to-ligaportugal-home');
        if (lpBackBtn) {
          lpBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        lpBackBar.hidden = true;
      }
    }

    // Eredivisie Simulator Back-Bar
    const edBackBar = document.getElementById('eredivisie-sim-back-bar');
    if (edBackBar) {
      if (activeTournKey === 'eredivisie' && state.subView === 'sim') {
        edBackBar.hidden = false;
        const edBackBtn = document.getElementById('btn-back-to-eredivisie-home');
        if (edBackBtn) {
          edBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        edBackBar.hidden = true;
      }
    }

    // Trendyol Süper Lig Simulator Back-Bar
    const slBackBar = document.getElementById('superlig-sim-back-bar');
    if (slBackBar) {
      if (activeTournKey === 'superLig' && state.subView === 'sim') {
        slBackBar.hidden = false;
        const slBackBtn = document.getElementById('btn-back-to-superlig-home');
        if (slBackBtn) {
          slBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        slBackBar.hidden = true;
      }
    }

    // Scottish Premiership Simulator Back-Bar
    const spBackBar = document.getElementById('scottishprem-sim-back-bar');
    if (spBackBar) {
      if (activeTournKey === 'scottishPrem' && state.subView === 'sim') {
        spBackBar.hidden = false;
        const spBackBtn = document.getElementById('btn-back-to-scottishprem-home');
        if (spBackBtn) {
          spBackBtn.onclick = () => {
            state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        spBackBar.hidden = true;
      }
    }

    renderStageTabs();
    renderStageViewport();
  }

  // ---------------------------------------------------------------------------
  // KNOCKOUT BRACKET PLACEHOLDERS & STAGE METADATA
  // ---------------------------------------------------------------------------
  const STAGE_META = {
    r32: { title: 'ROUND OF 32', count: 16, prevStage: 'Group Stage' },
    r16: { title: 'ROUND OF 16', count: 8, prevStage: 'Round of 32' },
    qf: { title: 'QUARTERFINALS', count: 4, prevStage: 'Round of 16' },
    sf: { title: 'SEMIFINALS', count: 2, prevStage: 'Quarterfinals' },
    gf: { title: 'GRAND FINAL', count: 1, prevStage: 'Semifinals' }
  };

  const WC_R32_PLACEHOLDERS = [
    { fixture: 'Fixture 1', home: 'Winner Group A', away: 'Runner-up Group B' },
    { fixture: 'Fixture 2', home: 'Winner Group C', away: 'Runner-up Group D' },
    { fixture: 'Fixture 3', home: 'Winner Group E', away: 'Runner-up Group F' },
    { fixture: 'Fixture 4', home: 'Winner Group G', away: 'Runner-up Group H' },
    { fixture: 'Fixture 5', home: 'Winner Group I', away: 'Runner-up Group J' },
    { fixture: 'Fixture 6', home: 'Winner Group K', away: 'Runner-up Group L' },
    { fixture: 'Fixture 7', home: 'Winner Group B', away: 'Best 3rd Place (Grp A/C/D)' },
    { fixture: 'Fixture 8', home: 'Winner Group D', away: 'Best 3rd Place (Grp B/E/F)' },
    { fixture: 'Fixture 9', home: 'Winner Group F', away: 'Best 3rd Place (Grp C/G/H)' },
    { fixture: 'Fixture 10', home: 'Winner Group H', away: 'Best 3rd Place (Grp I/J/K)' },
    { fixture: 'Fixture 11', home: 'Winner Group J', away: 'Best 3rd Place (Grp D/E/L)' },
    { fixture: 'Fixture 12', home: 'Winner Group L', away: 'Best 3rd Place (Grp F/G/H)' },
    { fixture: 'Fixture 13', home: 'Runner-up Group A', away: 'Runner-up Group C' },
    { fixture: 'Fixture 14', home: 'Runner-up Group E', away: 'Runner-up Group G' },
    { fixture: 'Fixture 15', home: 'Runner-up Group I', away: 'Runner-up Group K' },
    { fixture: 'Fixture 16', home: 'Best 3rd Place (7th)', away: 'Best 3rd Place (8th)' }
  ];

  const R16_PLACEHOLDERS = [
    { fixture: 'Match 1', home: 'Winner R32 #1', away: 'Winner R32 #2' },
    { fixture: 'Match 2', home: 'Winner R32 #3', away: 'Winner R32 #4' },
    { fixture: 'Match 3', home: 'Winner R32 #5', away: 'Winner R32 #6' },
    { fixture: 'Match 4', home: 'Winner R32 #7', away: 'Winner R32 #8' },
    { fixture: 'Match 5', home: 'Winner R32 #9', away: 'Winner R32 #10' },
    { fixture: 'Match 6', home: 'Winner R32 #11', away: 'Winner R32 #12' },
    { fixture: 'Match 7', home: 'Winner R32 #13', away: 'Winner R32 #14' },
    { fixture: 'Match 8', home: 'Winner R32 #15', away: 'Winner R32 #16' }
  ];

  const QF_PLACEHOLDERS = [
    { fixture: 'Quarterfinal 1', home: 'Winner R16 #1', away: 'Winner R16 #2' },
    { fixture: 'Quarterfinal 2', home: 'Winner R16 #3', away: 'Winner R16 #4' },
    { fixture: 'Quarterfinal 3', home: 'Winner R16 #5', away: 'Winner R16 #6' },
    { fixture: 'Quarterfinal 4', home: 'Winner R16 #7', away: 'Winner R16 #8' }
  ];

  const SF_PLACEHOLDERS = [
    { fixture: 'Semifinal 1', home: 'Winner QF #1', away: 'Winner QF #2' },
    { fixture: 'Semifinal 2', home: 'Winner QF #3', away: 'Winner QF #4' }
  ];

  const GF_PLACEHOLDERS = [
    { fixture: 'Grand Final', home: 'Winner Semifinal 1', away: 'Winner Semifinal 2' }
  ];

  function getPlaceholdersForStage(stageKey) {
    if (stageKey === 'r32') return WC_R32_PLACEHOLDERS;
    if (stageKey === 'r16') return R16_PLACEHOLDERS;
    if (stageKey === 'qf') return QF_PLACEHOLDERS;
    if (stageKey === 'sf') return SF_PLACEHOLDERS;
    if (stageKey === 'gf') return GF_PLACEHOLDERS;
    return [];
  }

  function scrollToStageSection(stageKey) {
    setTimeout(() => {
      const scrollOuter = document.querySelector('.bracket-scroll-flip-outer');
      const stageViewport = document.querySelector('.tournament-stage-viewport');

      if (stageViewport && typeof stageViewport.getBoundingClientRect === 'function' && typeof window.scrollTo === 'function') {
        const yOffset = -70;
        const y = stageViewport.getBoundingClientRect().top + (window.pageYOffset || 0) + yOffset;
        window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      }

      if (stageKey === 'groups') {
        const groupsContainer = document.getElementById('groups-grid-container');
        if (groupsContainer && typeof groupsContainer.scrollIntoView === 'function') {
          groupsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else if (scrollOuter && typeof scrollOuter.scrollTo === 'function') {
        const targetCol = document.getElementById(`col-${stageKey}`);
        if (targetCol) {
          const targetLeft = targetCol.offsetLeft || 0;
          scrollOuter.scrollTo({ left: Math.max(0, targetLeft - 20), behavior: 'smooth' });
        }
      }
    }, 80);
  }

  function setStageTab(stageKey, shouldScroll = false) {
    activeStageFilter = stageKey || 'all';

    const state = tournamentState[activeTournKey];
    if (state) {
      state.subView = 'sim';
      // NOTE: Do NOT call ensureStagePrerequisites here.
      // Switching tabs must ONLY change the view — never auto-simulate matches.
      // ensureStagePrerequisites is called only by simulateStageWithClock (the simulate button).
    }

    document.querySelectorAll('#stage-tabs-group .bracket-tab').forEach(t => {
      const isMatch = (t.dataset.stage === activeStageFilter);
      t.classList.toggle('active', isMatch);
      t.setAttribute('aria-selected', String(isMatch));
      if (isMatch) {
        const stageBadge = document.getElementById('current-stage-badge');
        if (stageBadge) stageBadge.textContent = `VIEW: ${t.textContent.trim()}`;
      }
    });

    renderActiveTournament();

    if (shouldScroll) {
      scrollToStageSection(stageKey);
    }
  }

  function renderStageTabs() {
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    const r32Tab = document.querySelector('#stage-tabs-group .bracket-tab[data-stage="r32"]');
    const r16Tab = document.querySelector('#stage-tabs-group .bracket-tab[data-stage="r16"]');
    const qfTab = document.querySelector('#stage-tabs-group .bracket-tab[data-stage="qf"]');
    const sfTab = document.querySelector('#stage-tabs-group .bracket-tab[data-stage="sf"]');
    const gfTab = document.querySelector('#stage-tabs-group .bracket-tab[data-stage="gf"]');

    if (config.format === 'leagueSeason') {
      if (r32Tab) r32Tab.hidden = true;
      if (r16Tab) r16Tab.hidden = true;
      if (qfTab) qfTab.hidden = true;
      if (sfTab) sfTab.hidden = true;
      if (gfTab) gfTab.hidden = true;
    } else {
      if (r32Tab) r32Tab.hidden = config.format !== 'worldcup48';
      if (r16Tab) r16Tab.hidden = config.format === 'copa16' || config.format === 'genericCup';
      if (qfTab) qfTab.hidden = false;
      if (sfTab) sfTab.hidden = false;
      if (gfTab) gfTab.hidden = false;
    }
  }

  function renderKnockoutStage(stageKey, state, isSingleStage) {
    const meta = STAGE_META[stageKey] || { title: stageKey.toUpperCase(), count: 0, prevStage: 'Previous Stage' };
    const matches = state[stageKey] || [];
    const isPopulated = matches.length > 0;
    const isFinal = stageKey === 'gf';

    let contentHtml = '';

    if (isPopulated) {
      const matchCards = matches.map((m, idx) => renderMatchCard(m, stageKey, idx, isFinal)).join('');

      if (isSingleStage) {
        contentHtml = `
          <div class="bracket-column expanded-stage" id="col-${stageKey}">
            <div class="bracket-column-header-bar">
              <div class="column-header">🏆 ${meta.title} (${matches.length} FIXTURES)</div>
            </div>
            <div class="bracket-cards-grid">
              ${matchCards}
            </div>
          </div>
        `;
      } else {
        contentHtml = `
          <div class="bracket-column" id="col-${stageKey}">
            <div class="column-header">${meta.title}</div>
            ${matchCards}
          </div>
        `;
      }
    } else {
      // Render Placeholder View
      const placeholders = getPlaceholdersForStage(stageKey);
      const prevActionText = state.groups && !state.groupsPlayed
        ? 'SIMULATE GROUP STAGE'
        : `SIMULATE UP TO ${meta.title}`;

      const pendingBanner = `
        <div class="stage-pending-banner">
          <div class="stage-pending-text">
            <span>⏳</span>
            <span>${meta.title} PENDING — ${meta.count} FIXTURE SLOTS (Awaiting ${meta.prevStage} Qualification)</span>
          </div>
          <button type="button" class="btn-stage-quick-action" data-stage="${stageKey}" data-action="advance-stage">⚡ ${prevActionText}</button>
        </div>
      `;

      const placeholderCards = placeholders.map((p, idx) => renderPlaceholderMatchCard(p, stageKey, idx, isFinal)).join('');

      if (isSingleStage) {
        contentHtml = `
          <div class="bracket-column expanded-stage" id="col-${stageKey}">
            <div class="bracket-column-header-bar">
              <div class="column-header">⏳ ${meta.title} (${meta.count} FIXTURES)</div>
            </div>
            ${pendingBanner}
            <div class="bracket-cards-grid">
              ${placeholderCards}
            </div>
          </div>
        `;
      } else {
        contentHtml = `
          <div class="bracket-column" id="col-${stageKey}">
            <div class="column-header">${meta.title}</div>
            <div class="empty-stage-hint">Pending ${meta.prevStage} Completion</div>
            ${placeholderCards.slice(0, 4)}
            ${placeholderCards.length > 4 ? `<div class="empty-stage-hint">+ ${placeholders.length - 4} More Fixtures Pending</div>` : ''}
          </div>
        `;
      }
    }

    return contentHtml;
  }

  function renderStageViewport() {
    const groupsContainer = document.getElementById('groups-grid-container');
    const bracketContainer = document.getElementById('bracket-tree-container');
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];

    if (!groupsContainer || !bracketContainer) return;

    if (config.format === 'leagueSeason') {
      bracketContainer.hidden = true;
      groupsContainer.hidden = false;
      renderLeagueSeasonTable(state, groupsContainer);
      return;
    }

    // --- World Cup Home Landing Page ---
    if (activeTournKey === 'wc' && state.subView !== 'sim') {
      bracketContainer.hidden = true;
      groupsContainer.hidden = false;
      renderWcHomePage(state, groupsContainer);
      return;
    }

    // --- UEFA Champions League & European League Home Landing Page ---
    if (activeTournKey === 'ucl' && state.subView !== 'sim') {
      bracketContainer.hidden = true;
      groupsContainer.hidden = false;
      renderUclHomePage(state, groupsContainer);
      return;
    }

    // --- UEFA EURO Home Landing Page ---
    if (activeTournKey === 'euro' && state.subView !== 'sim') {
      bracketContainer.hidden = true;
      groupsContainer.hidden = false;
      renderEuroHomePage(state, groupsContainer);
      return;
    }

    // --- Copa América Home Landing Page ---
    if (activeTournKey === 'copa' && state.subView !== 'sim') {
      bracketContainer.hidden = true;
      groupsContainer.hidden = false;
      renderCopaHomePage(state, groupsContainer);
      return;
    }

    const showGroups = state.groups && (activeStageFilter === 'groups' || (activeStageFilter === 'all' && !state.groupsPlayed));
    groupsContainer.hidden = !showGroups;
    if (showGroups) {
      renderGroupsGrid(state, groupsContainer);
    }

    if (activeStageFilter === 'groups') {
      bracketContainer.hidden = true;
      return;
    }

    bracketContainer.hidden = false;
    const isSingleStage = activeStageFilter !== 'all';
    bracketContainer.classList.toggle('single-stage-view', isSingleStage);

    let html = '';

    if (activeStageFilter === 'all') {
      if (config.format === 'worldcup48') {
        html += renderKnockoutStage('r32', state, false);
      }
      if (config.format !== 'copa16' && config.format !== 'genericCup') {
        html += renderKnockoutStage('r16', state, false);
      }
      html += renderKnockoutStage('qf', state, false);
      html += renderKnockoutStage('sf', state, false);
      html += renderKnockoutStage('gf', state, false);
    } else {
      // Single Stage Filtered View
      html += renderKnockoutStage(activeStageFilter, state, true);
    }

    bracketContainer.innerHTML = html;

    // Attach simulation listeners
    bracketContainer.querySelectorAll('.btn-sim-single').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const stage = btn.dataset.stage;
        const idx = parseInt(btn.dataset.idx, 10);
        simulateSingleMatch(stage, idx);
      });
    });

    bracketContainer.querySelectorAll('.btn-stage-quick-action').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetStage = btn.dataset.stage;
        if (targetStage) {
          simulateStageWithClock(targetStage);
        } else {
          const mainStageBtn = document.getElementById('sim-stage-action-btn');
          if (mainStageBtn && !mainStageBtn.disabled) {
            mainStageBtn.click();
          }
        }
      });
    });
  }

  function recalculateLeagueStandings(state) {
    if (!state.leagueTable || !state.matchdays) return;

    state.leagueTable.forEach(r => {
      r.mp = 0; r.w = 0; r.d = 0; r.l = 0; r.gf = 0; r.ga = 0; r.gd = 0; r.pts = 0;
    });

    state.matchdays.forEach(round => {
      round.forEach(m => {
        if (m.isSimulated) {
          const homeRow = state.leagueTable.find(r => r.club.toUpperCase() === m.home.toUpperCase());
          const awayRow = state.leagueTable.find(r => r.club.toUpperCase() === m.away.toUpperCase());
          if (homeRow && awayRow) {
            homeRow.mp++;
            awayRow.mp++;
            homeRow.gf += m.scoreHome;
            homeRow.ga += m.scoreAway;
            awayRow.gf += m.scoreAway;
            awayRow.ga += m.scoreHome;

            if (m.scoreHome > m.scoreAway) {
              homeRow.w++;
              homeRow.pts += 3;
              awayRow.l++;
            } else if (m.scoreAway > m.scoreHome) {
              awayRow.w++;
              awayRow.pts += 3;
              homeRow.l++;
            } else {
              homeRow.d++;
              homeRow.pts += 1;
              awayRow.d++;
              awayRow.pts += 1;
            }
          }
        }
      });
    });

    state.leagueTable.forEach(r => { r.gd = r.gf - r.ga; });
    state.leagueTable.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    state.leagueTable.forEach((r, idx) => { r.pos = idx + 1; });

    const allMatches = state.matchdays.flat();
    const allDone = allMatches.length > 0 && allMatches.every(m => m.isSimulated);
    if (allDone) {
      state.champion = state.leagueTable[0].club;
    }
  }

  function isMatchdayUnlocked(state, mdIdx) {
    if (!state || !state.matchdays || mdIdx === 0) return true;
    if (mdIdx < 0 || mdIdx >= state.matchdays.length) return false;
    for (let i = 0; i < mdIdx; i++) {
      const round = state.matchdays[i];
      if (!round || !round.every(m => m.isSimulated)) {
        return false;
      }
    }
    return true;
  }

  function getFirstPendingMatchdayIdx(state) {
    if (!state || !state.matchdays) return 0;
    const idx = state.matchdays.findIndex(round => round.some(m => !m.isSimulated));
    return idx === -1 ? state.matchdays.length : idx;
  }

  // ---------------------------------------------------------------------------
  // 7A-2. DYNAMIC YOUTUBE HERO VIDEO BACKGROUND SYSTEM
  // ---------------------------------------------------------------------------
  const TOURNAMENT_HERO_VIDEOS = Object.freeze(window.ARENA_HERO_VIDEOS || {});

  function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const clean = urlOrId.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(clean)) return clean;
    const match = clean.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : '';
  }

  function getHeroVideoId(tournKey) {
    let savedId = '';
    try {
      savedId = localStorage.getItem(`arena_hero_video_${tournKey}`) || '';
    } catch (e) {}

    const defaultId = TOURNAMENT_HERO_VIDEOS[tournKey]?.id || '';
    const videoId = /^[a-zA-Z0-9_-]{11}$/.test(savedId) ? savedId : defaultId;
    return /^[a-zA-Z0-9_-]{11}$/.test(videoId) ? videoId : '';
  }

  function setHeroVideoId(tournKey, urlOrId) {
    const vidId = extractYouTubeId(urlOrId);
    if (!vidId) return;
    try {
      localStorage.setItem(`arena_hero_video_${tournKey}`, vidId);
    } catch(e) {}
  }

  function renderHeroVideoBgHtml(tournKey) {
    const videoId = getHeroVideoId(tournKey);
    if (!videoId) return '';
    const videoConfig = TOURNAMENT_HERO_VIDEOS[tournKey] || {};
    const videoTitle = videoConfig.title || `${TOURNAMENTS_CONFIG[tournKey]?.name || 'Tournament'} highlights`;
    const startSec = Number(videoConfig.start) || 0;
    const startParam = startSec > 0 ? `&start=${startSec}` : '';
    return `
      <div class="hero-video-bg-wrap" id="hero-video-bg-${tournKey}">
        <iframe
          class="hero-video-iframe"
          data-tourn="${tournKey}"
          data-start="${startSec}"
          src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&playsinline=1&rel=0&disablekb=1&modestbranding=1&enablejsapi=1${startParam}"
          title="${videoTitle}"
          tabindex="-1"
          aria-hidden="true"
          frameborder="0"
          referrerpolicy="strict-origin-when-cross-origin"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen>
        </iframe>
        <div class="hero-video-click-shield" aria-hidden="true"></div>
      </div>
    `;
  }

  function renderHeroVideoBadgeHtml(tournKey) {
    return '';
  }

  // Handle YouTube player state & graceful error fallback
  if (typeof window !== 'undefined' && !window._heroVideoLoopAttached) {
    window._heroVideoLoopAttached = true;
    window.addEventListener('message', (ev) => {
      try {
        const msg = typeof ev.data === 'string' ? JSON.parse(ev.data) : ev.data;
        // On video end -> loop back to beginning (or specified start time, e.g. 10s)
        if (msg && msg.event === 'onStateChange' && msg.info === 0) {
          document.querySelectorAll('.hero-video-iframe').forEach(fr => {
            const startSec = Number(fr.dataset.start) || 0;
            fr.contentWindow?.postMessage(JSON.stringify({event:'command', func:'seekTo', args:[startSec, true]}), '*');
            fr.contentWindow?.postMessage(JSON.stringify({event:'command', func:'playVideo', args:[]}), '*');
          });
        }
        // If YouTube emits onError (101/150 embedding restricted, 100 not found, 2 invalid param)
        // Gracefully hide the iframe so the stadium graphic/image background is visible seamlessly
        if (msg && (msg.event === 'onError' || (msg.info && msg.info.playerState === -1 && msg.info.errorCode))) {
          document.querySelectorAll('.hero-video-bg-wrap').forEach(wrap => {
            wrap.style.display = 'none';
          });
        }
      } catch(_) {}
    });
  }

  window.openHeroVideoModal = function(tournKey) {
    const currentId = getHeroVideoId(tournKey);
    const existing = document.getElementById('hero-video-edit-modal');
    if (existing) existing.remove();

    const tournName = TOURNAMENTS_CONFIG[tournKey]?.title || tournKey.toUpperCase();
    const modalHtml = `
      <div class="hero-video-modal-backdrop" id="hero-video-edit-modal">
        <div class="hero-video-modal-card">
          <div class="hvm-title">
            <i class="fa-solid fa-film" style="color:#6366f1;"></i>
            <span>Set Hero Video Highlight</span>
          </div>
          <p class="hvm-desc">
            Paste a YouTube video URL or ID to play in the background hero of <strong>${tournName}</strong> (muted, auto-looping).
          </p>
          <div class="hvm-input-group">
            <label class="hvm-label" for="hvm-url-input">YouTube Link / Video ID</label>
            <input type="text" class="hvm-input" id="hvm-url-input" placeholder="e.g. https://www.youtube.com/watch?v=fm20OYYxLmU" value="${currentId ? 'https://www.youtube.com/watch?v=' + currentId : ''}" />
          </div>
          <div class="hvm-actions">
            <button type="button" class="hvm-btn-cancel" id="hvm-cancel-btn">Cancel</button>
            <button type="button" class="hvm-btn-save" id="hvm-save-btn">Save &amp; Apply</button>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    const modalEl = document.getElementById('hero-video-edit-modal');
    const inputEl = document.getElementById('hvm-url-input');
    const saveBtn = document.getElementById('hvm-save-btn');
    const cancelBtn = document.getElementById('hvm-cancel-btn');

    cancelBtn.onclick = () => modalEl.remove();
    modalEl.onclick = (e) => { if (e.target === modalEl) modalEl.remove(); };

    saveBtn.onclick = () => {
      const val = inputEl.value.trim();
      if (val) {
        setHeroVideoId(tournKey, val);
        renderActiveTournament();
      }
      modalEl.remove();
    };
  };

  // ---------------------------------------------------------------------------
  // 7B. FIFA WORLD CUP 2026 SHOWCASE HOME PAGE
  // ---------------------------------------------------------------------------
  function renderWcHomePage(state, container) {
    container.innerHTML = `
      <div class="wc-showcase-wrapper">
        <div class="wc-hero" id="wc-interactive-hero">
          ${renderHeroVideoBgHtml('wc')}
          ${renderHeroVideoBadgeHtml('wc')}
          <div class="wc-hero-overlay"></div>
          <div class="wc-spotlight-glow" id="wc-spotlight"></div>
          
          <div class="wc-hero-content">
            <!-- Top Tournament Tag -->
            <div class="wc-badge-top">
              <span class="wc-badge-icon"><i class="fa-solid fa-trophy"></i></span>
              <span class="wc-badge-text">WORLD CUP 2026</span>
            </div>

            <!-- Main Display Headline -->
            <h1 class="wc-hero-title">
              <span class="wc-title-line-1">THE WORLD'S</span>
              <span class="wc-title-line-2 wc-gold-text">GREATEST</span>
              <span class="wc-title-line-3">STAGE</span>
            </h1>

            <!-- Tagline Subtitle -->
            <p class="wc-hero-sub">One tournament. Every nation. One champion.</p>

            <!-- Action CTAs -->
            <div class="wc-hero-actions">
              <button type="button" class="wc-btn-primary" id="btn-wc-sim-now" style="background: linear-gradient(135deg, #eab308, #ca8a04); border-color: #fde047; color: #0f172a; font-weight: 800; box-shadow: 0 4px 20px rgba(234, 179, 8, 0.4);">
                <i class="fa-solid fa-bolt"></i>
                <span>SIMULATE WORLD CUP</span>
                <i class="fa-solid fa-play"></i>
              </button>

              <button type="button" class="wc-btn-custom-draw" id="btn-wc-custom-draw" onclick="window.openCustomDrawModal &amp;&amp; window.openCustomDrawModal()">
                <i class="fa-solid fa-sliders"></i>
                <span>CUSTOM DRAW (48)</span>
              </button>
            </div>
          </div>

          <!-- Bottom Stats Ribbon (Full Width Clean Bar) -->
          <div class="wc-stats-ribbon">
            <div class="wc-ribbon-card">
              <div class="wc-ribbon-icon-wrap">
                <i class="fa-solid fa-globe"></i>
              </div>
              <div class="wc-ribbon-data">
                <span class="wc-ribbon-number">48</span>
                <span class="wc-ribbon-label">NATIONS</span>
              </div>
            </div>

            <div class="wc-ribbon-divider"></div>

            <div class="wc-ribbon-card">
              <div class="wc-ribbon-icon-wrap">
                <i class="fa-solid fa-trophy"></i>
              </div>
              <div class="wc-ribbon-data">
                <span class="wc-ribbon-number">104</span>
                <span class="wc-ribbon-label">MATCHES</span>
              </div>
            </div>

            <div class="wc-ribbon-divider"></div>

            <div class="wc-ribbon-card">
              <div class="wc-ribbon-icon-wrap">
                <i class="fa-regular fa-calendar-days"></i>
              </div>
              <div class="wc-ribbon-data">
                <span class="wc-ribbon-number">39</span>
                <span class="wc-ribbon-label">DAYS OF GLORY</span>
              </div>
            </div>

            <div class="wc-ribbon-divider"></div>

            <div class="wc-ribbon-card">
              <div class="wc-ribbon-icon-wrap">
                <i class="fa-solid fa-users"></i>
              </div>
              <div class="wc-ribbon-data">
                <span class="wc-ribbon-number">8B+</span>
                <span class="wc-ribbon-label">FANS UNITED</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Bind Hero Actions
    const simNowBtn = container.querySelector('#btn-wc-sim-now');
    if (simNowBtn) {
      simNowBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        state.subView = 'sim';
        state.groupsPlayed = false;
        activeStageFilter = 'all';
        renderActiveTournament();
        setTimeout(() => {
          const simStageBtn = document.getElementById('sim-stage-action-btn');
          if (simStageBtn && !simStageBtn.disabled) {
            simStageBtn.click();
          }
        }, 100);
      });
    }



    const customDrawBtn = container.querySelector('#btn-wc-custom-draw');
    if (customDrawBtn) {
      customDrawBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openCustomDrawModal();
      });
    }

// Dynamic mouse-tracking interactive spotlight
    const heroEl = container.querySelector('#wc-interactive-hero');
    const spotEl = container.querySelector('#wc-spotlight');
    if (heroEl && spotEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Smooth tracking with eased movement
        spotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
        spotEl.style.opacity = '1';
        // Add subtle pulse on mouse enter
        spotEl.style.transition = 'transform 0.1s ease, opacity 0.3s ease';
      });
      heroEl.addEventListener('mouseleave', () => {
        spotEl.style.opacity = '0';
        spotEl.style.transform = '';
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7B-1. UEFA EURO SHOWCASE HOME PAGE
  // ---------------------------------------------------------------------------
  function renderEuroHomePage(state, container) {
    const euroChampionsHonorRoll = [
      { year: '2024', team: 'SPAIN', titles: '4', result: '2 - 1 vs England' },
      { year: '2020', team: 'ITALY', titles: '2', result: '1(3) - 1(2) vs England' },
      { year: '2016', team: 'PORTUGAL', titles: '1', result: '1 - 0 vs France' },
      { year: '2012', team: 'SPAIN', titles: '3', result: '4 - 0 vs Italy' },
      { year: '2008', team: 'SPAIN', titles: '2', result: '1 - 0 vs Germany' }
    ];

    container.innerHTML = `
      <div class="euro-showcase-wrapper">
        <div class="euro-hero" id="euro-interactive-hero">
          ${renderHeroVideoBgHtml('euro')}
          ${renderHeroVideoBadgeHtml('euro')}
          <div class="euro-hero-overlay"></div>
          <div class="euro-spotlight-glow" id="euro-spotlight"></div>

          <div class="euro-hero-layout">
            <!-- Left: Roll of Honor Table (Previous Champions) -->
            <div class="euro-cyber-card">
              <div class="euro-cyber-header">
                <span><span class="euro-sparkle">✦</span> EURO RECENT CHAMPIONS // ROLL OF HONOR <span class="euro-sparkle">✦</span></span>
                <span style="font-size:0.7rem;color:#FFD700;letter-spacing:0.5px;">HISTORY</span>
              </div>
              <table class="euro-cyber-table">
                <thead>
                  <tr>
                    <th style="width:48px;">YEAR</th>
                    <th>CHAMPION</th>
                    <th style="text-align:center;">TITLES</th>
                    <th style="text-align:right;">FINAL RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  ${euroChampionsHonorRoll.map((r, idx) => `
                    <tr>
                      <td class="pos-col" style="font-size:0.8rem;color:#FFD700;">${r.year}</td>
                      <td class="team-col">
                        <div style="display:flex;align-items:center;gap:8px;">
                          ${getTeamLogoHtml(r.team)}
                          <strong style="letter-spacing:0.04em;">${r.team}</strong>
                          ${idx === 0 ? '<i class="fa-solid fa-crown widget-crown-icon" style="color:#FFD700;"></i>' : ''}
                        </div>
                      </td>
                      <td style="text-align:center;color:#FFD700;font-weight:800;font-family:var(--font-hud);">${r.titles} 🏆</td>
                      <td class="pnt-col" style="font-size:0.78rem;color:#E2E8F0;font-weight:600;text-align:right;">${r.result}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Right: UEFA EURO Branding & Actions -->
            <div class="euro-hero-right">
              <div class="euro-badge-top">
                <i class="fa-solid fa-trophy" style="color:#FFD700;"></i>
                <span>UEFA EUROPEAN CHAMPIONSHIP</span>
              </div>

              <h1 class="euro-hero-title">
                THE BATTLE FOR
                <span class="euro-gold-text">EUROPEAN GLORY</span>
              </h1>

              <p class="euro-hero-desc">
                24 elite European contenders clash across 6 groups for continental supremacy and the Henri Delaunay Trophy.
              </p>

              <div class="euro-hero-actions">
                <button type="button" class="euro-btn-primary" id="btn-euro-sim-now">
                  <i class="fa-solid fa-bolt"></i>
                  <span>SIMULATE EURO</span>
                  <i class="fa-solid fa-play"></i>
                </button>

                <button type="button" class="euro-btn-secondary" id="btn-euro-enter">
                  <i class="fa-solid fa-table-cells"></i>
                  <span>VIEW GROUPS & BRACKET</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Stats Ribbon -->
          <div class="euro-stats-ribbon">
            <div class="euro-ribbon-card">
              <div class="euro-ribbon-icon-wrap"><i class="fa-solid fa-earth-europe"></i></div>
              <div class="euro-ribbon-data">
                <span class="euro-ribbon-number">24</span>
                <span class="euro-ribbon-label">NATIONS</span>
              </div>
            </div>
            <div class="euro-ribbon-divider"></div>
            <div class="euro-ribbon-card">
              <div class="euro-ribbon-icon-wrap"><i class="fa-solid fa-futbol"></i></div>
              <div class="euro-ribbon-data">
                <span class="euro-ribbon-number">51</span>
                <span class="euro-ribbon-label">MATCHES</span>
              </div>
            </div>
            <div class="euro-ribbon-divider"></div>
            <div class="euro-ribbon-card">
              <div class="euro-ribbon-icon-wrap"><i class="fa-solid fa-layer-group"></i></div>
              <div class="euro-ribbon-data">
                <span class="euro-ribbon-number">6</span>
                <span class="euro-ribbon-label">GROUPS (A–F)</span>
              </div>
            </div>
            <div class="euro-ribbon-divider"></div>
            <div class="euro-ribbon-card">
              <div class="euro-ribbon-icon-wrap"><i class="fa-regular fa-calendar-days"></i></div>
              <div class="euro-ribbon-data">
                <span class="euro-ribbon-number">31</span>
                <span class="euro-ribbon-label">DAYS OF ACTION</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Event listeners
    const simNowBtn = container.querySelector('#btn-euro-sim-now');
    if (simNowBtn) {
      simNowBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        state.subView = 'sim';
        state.groupsPlayed = false;
        activeStageFilter = 'all';
        renderActiveTournament();
        setTimeout(() => {
          const simStageBtn = document.getElementById('sim-stage-action-btn');
          if (simStageBtn && !simStageBtn.disabled) {
            simStageBtn.click();
          }
        }, 100);
      });
    }

    const enterBtn = container.querySelector('#btn-euro-enter');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        state.subView = 'sim';
        activeStageFilter = 'all';
        renderActiveTournament();
      });
    }

    // Dynamic mouse-tracking interactive spotlight
    const heroEl = container.querySelector('#euro-interactive-hero');
    const spotEl = container.querySelector('#euro-spotlight');
    if (heroEl && spotEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotEl.style.transform = `translate(${x - 225}px, ${y - 225}px)`;
        spotEl.style.opacity = '1';
        spotEl.style.transition = 'transform 0.1s ease, opacity 0.3s ease';
      });
      heroEl.addEventListener('mouseleave', () => {
        spotEl.style.opacity = '0';
        spotEl.style.transform = '';
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7B-2. COPA AMÉRICA SHOWCASE HOME PAGE
  // ---------------------------------------------------------------------------
  function renderCopaHomePage(state, container) {
    const copaChampionsHonorRoll = [
      { year: '2024', team: 'ARGENTINA', titles: '16', result: '1 - 0 vs Colombia' },
      { year: '2021', team: 'ARGENTINA', titles: '15', result: '1 - 0 vs Brazil' },
      { year: '2019', team: 'BRAZIL', titles: '9', result: '3 - 1 vs Peru' },
      { year: '2016', team: 'CHILE', titles: '2', result: '0(4) - 0(2) vs Argentina' },
      { year: '2015', team: 'CHILE', titles: '1', result: '0(4) - 0(1) vs Argentina' }
    ];

    container.innerHTML = `
      <div class="copa-showcase-wrapper">
        <div class="copa-hero" id="copa-interactive-hero">
          ${renderHeroVideoBgHtml('copa')}
          ${renderHeroVideoBadgeHtml('copa')}
          <div class="copa-hero-overlay"></div>
          <div class="copa-spotlight-glow" id="copa-spotlight"></div>

          <div class="copa-hero-layout">
            <!-- Left: Roll of Honor Table (Previous Champions) -->
            <div class="copa-cyber-card">
              <div class="copa-cyber-header">
                <span><span class="copa-sparkle">✦</span> COPA AMÉRICA // ROLL OF HONOR <span class="copa-sparkle">✦</span></span>
                <span style="font-size:0.7rem;color:#F59E0B;letter-spacing:0.5px;">HISTORY</span>
              </div>
              <table class="copa-cyber-table">
                <thead>
                  <tr>
                    <th style="width:48px;">YEAR</th>
                    <th>CHAMPION</th>
                    <th style="text-align:center;">TITLES</th>
                    <th style="text-align:right;">FINAL RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  ${copaChampionsHonorRoll.map((r, idx) => `
                    <tr>
                      <td class="pos-col" style="font-size:0.8rem;color:#F59E0B;">${r.year}</td>
                      <td class="team-col">
                        <div style="display:flex;align-items:center;gap:8px;">
                          ${getTeamLogoHtml(r.team)}
                          <strong style="letter-spacing:0.04em;">${r.team}</strong>
                          ${idx === 0 ? '<i class="fa-solid fa-crown widget-crown-icon" style="color:#F59E0B;"></i>' : ''}
                        </div>
                      </td>
                      <td style="text-align:center;color:#F59E0B;font-weight:800;font-family:var(--font-hud);">${r.titles} 🏆</td>
                      <td class="pnt-col" style="font-size:0.78rem;color:#E2E8F0;font-weight:600;text-align:right;">${r.result}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Right: Copa América Branding & Actions -->
            <div class="copa-hero-right">
              <div class="copa-badge-top">
                <i class="fa-solid fa-trophy" style="color:#F59E0B;"></i>
                <span>CONMEBOL COPA AMÉRICA</span>
              </div>

              <h1 class="copa-hero-title">
                SOUTH AMERICA'S
                <span class="copa-gold-text">GREATEST PASSION</span>
              </h1>

              <p class="copa-hero-desc">
                16 elite nations from across the Americas clash for continental dominance and eternal football glory.
              </p>

              <div class="copa-hero-actions">
                <button type="button" class="copa-btn-primary" id="btn-copa-sim-now">
                  <i class="fa-solid fa-bolt"></i>
                  <span>SIMULATE COPA</span>
                  <i class="fa-solid fa-play"></i>
                </button>

                <button type="button" class="copa-btn-secondary" id="btn-copa-enter">
                  <i class="fa-solid fa-table-cells"></i>
                  <span>VIEW GROUPS & BRACKET</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Bottom Stats Ribbon -->
          <div class="copa-stats-ribbon">
            <div class="copa-ribbon-card">
              <div class="copa-ribbon-icon-wrap"><i class="fa-solid fa-earth-americas"></i></div>
              <div class="copa-ribbon-data">
                <span class="copa-ribbon-number">16</span>
                <span class="copa-ribbon-label">NATIONS</span>
              </div>
            </div>
            <div class="copa-ribbon-divider"></div>
            <div class="copa-ribbon-card">
              <div class="copa-ribbon-icon-wrap"><i class="fa-solid fa-futbol"></i></div>
              <div class="copa-ribbon-data">
                <span class="copa-ribbon-number">32</span>
                <span class="copa-ribbon-label">MATCHES</span>
              </div>
            </div>
            <div class="copa-ribbon-divider"></div>
            <div class="copa-ribbon-card">
              <div class="copa-ribbon-icon-wrap"><i class="fa-solid fa-layer-group"></i></div>
              <div class="copa-ribbon-data">
                <span class="copa-ribbon-number">4</span>
                <span class="copa-ribbon-label">GROUPS (A–D)</span>
              </div>
            </div>
            <div class="copa-ribbon-divider"></div>
            <div class="copa-ribbon-card">
              <div class="copa-ribbon-icon-wrap"><i class="fa-solid fa-crown"></i></div>
              <div class="copa-ribbon-data">
                <span class="copa-ribbon-number">16</span>
                <span class="copa-ribbon-label">RECORD TITLES</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    // Event listeners
    const simNowBtn = container.querySelector('#btn-copa-sim-now');
    if (simNowBtn) {
      simNowBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        state.subView = 'sim';
        state.groupsPlayed = false;
        activeStageFilter = 'all';
        renderActiveTournament();
        setTimeout(() => {
          const simStageBtn = document.getElementById('sim-stage-action-btn');
          if (simStageBtn && !simStageBtn.disabled) {
            simStageBtn.click();
          }
        }, 100);
      });
    }

    const enterBtn = container.querySelector('#btn-copa-enter');
    if (enterBtn) {
      enterBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        state.subView = 'sim';
        activeStageFilter = 'all';
        renderActiveTournament();
      });
    }

    // Dynamic mouse-tracking interactive spotlight
    const heroEl = container.querySelector('#copa-interactive-hero');
    const spotEl = container.querySelector('#copa-spotlight');
    if (heroEl && spotEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotEl.style.transform = `translate(${x - 225}px, ${y - 225}px)`;
        spotEl.style.opacity = '1';
        spotEl.style.transition = 'transform 0.1s ease, opacity 0.3s ease';
      });
      heroEl.addEventListener('mouseleave', () => {
        spotEl.style.opacity = '0';
        spotEl.style.transform = '';
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 7C. UEFA CHAMPIONS LEAGUE (UCL) SHOWCASE & QUALIFICATION FEEDER ENGINE
  // ---------------------------------------------------------------------------
function getUclFeederStatus() {
    const defaultLeagues = [
      {
        key: 'pl',
        name: 'Premier League',
        flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
        icon: 'fa-shield-halved',
        defaultTop4Clubs: ['MANCHESTER CITY', 'ARSENAL', 'LIVERPOOL', 'ASTON VILLA']
      },
      {
        key: 'laliga',
        name: 'La Liga EA Sports',
        flag: '🇪🇸',
        icon: 'fa-futbol',
        defaultTop4Clubs: ['REAL MADRID', 'BARCELONA', 'GIRONA', 'ATLETICO MADRID']
      },
      {
        key: 'serieA',
        name: 'Serie A Enilive',
        flag: '🇮🇹',
        icon: 'fa-certificate',
        defaultTop4Clubs: ['INTER MILAN', 'AC MILAN', 'JUVENTUS', 'ATALANTA']
      },
      {
        key: 'bundesliga',
        name: 'Bundesliga',
        flag: '🇩🇪',
        icon: 'fa-trophy',
        defaultTop4Clubs: ['BAYER LEVERKUSEN', 'STUTTGART', 'BAYERN MUNICH', 'RB LEIPZIG']
      },
      {
        key: 'ligue1',
        name: 'Ligue 1 McDonald\'s',
        flag: '🇫🇷',
        icon: 'fa-trophy',
        defaultTop4Clubs: ['PSG', 'MONACO', 'BREST', 'LILLE']
      },
      {
        key: 'ligaPortugal',
        name: 'Liga Portugal Betclic',
        flag: '🇵🇹',
        icon: 'fa-trophy',
        defaultTop4Clubs: ['SPORTING CP', 'BENFICA', 'PORTO', 'BRAGA']
      },
      {
        key: 'eredivisie',
        name: 'Eredivisie',
        flag: '🇳🇱',
        icon: 'fa-certificate',
        defaultTop4Clubs: ['PSV', 'FEYENOORD', 'TWENTE', 'AJAX']
      },
      {
        key: 'superLig',
        name: 'Trendyol Süper Lig',
        flag: '🇹🇷',
        icon: 'fa-fire',
        defaultTop4Clubs: ['GALATASARAY', 'FENERBAHÇE', 'TRABZONSPOR', 'BEŞİKTAŞ']
      },
      {
        key: 'scottishPrem',
        name: 'Scottish Premiership',
        flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
        icon: 'fa-shield-halved',
        defaultTop4Clubs: ['CELTIC', 'RANGERS', 'HEARTS', 'KILMARNOCK']
      }
    ];

    let finishedCount = 0;
    const feederList = defaultLeagues.map(l => {
      if (l.isGateway) {
        return {
          ...l,
          isFinished: true,
          curMd: 34,
          totalMd: 34,
          top4: l.defaultTop4Clubs.map((club, idx) => ({
            club,
            pos: idx + 1,
            pts: 0,
            mp: 0
          }))
        };
      }

      const st = tournamentState[l.key];
      const totalMd = st?.totalMatchdays || 38;
      const curMd = st?.currentMatchday || 0;
      const isFinished = st && curMd >= totalMd && (st.matchdays || []).every(md => md.every(m => m.isSimulated));
      if (isFinished) finishedCount++;

      // Pull strictly live data from state.leagueTable
      let top4 = [];
      if (st?.leagueTable && st.leagueTable.length >= 4) {
        top4 = st.leagueTable.slice(0, 4).map((r, idx) => ({
          club: r.club,
          pos: r.pos || (idx + 1),
          pts: r.pts || 0,
          mp: r.mp || 0
        }));
      } else {
        top4 = l.defaultTop4Clubs.map((club, idx) => ({
          club,
          pos: idx + 1,
          pts: 0,
          mp: 0
        }));
      }

      return {
        ...l,
        isFinished,
        curMd,
        totalMd,
        top4
      };
    });

    const activeLeaguesCount = defaultLeagues.filter(l => !l.isGateway).length;
    return {
      feeders: feederList,
      finishedCount,
      totalFeeders: activeLeaguesCount,
      allFinished: finishedCount === activeLeaguesCount
    };
  }

  function syncUclFromLeagues() {
    const feederStatus = getUclFeederStatus();
    const qualifiedClubs = [];
    feederStatus.feeders.forEach(f => {
      f.top4.forEach(t => qualifiedClubs.push(t.club));
    });

const continentalGiants = [
      'PSG', 'BENFICA', 'SPORTING CP', 'CELTIC', 'MONACO', 'LILLE',
      'FEYENOORD', 'PSV', 'PORTO', 'GALATASARAY', 'FENERBAHÇE', 'TRABZONSPOR',
      'BEŞİKTAŞ', 'DINAMO ZAGREB', 'YOUNG BOYS'
    ];

    const finalPool = [...new Set([...qualifiedClubs, ...continentalGiants])].slice(0, 32);
    const groups = {};
    const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    groupLetters.forEach((letter, idx) => {
      groups[letter] = finalPool.slice(idx * 4, idx * 4 + 4).map(name => ({
        name, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0
      }));
    });

    if (tournamentState.ucl) {
      tournamentState.ucl.groups = groups;
      tournamentState.ucl.groupsPlayed = false;
      tournamentState.ucl.r16 = [];
      tournamentState.ucl.qf = [];
      tournamentState.ucl.sf = [];
      tournamentState.ucl.gf = [];
      tournamentState.ucl.champion = null;
      tournamentState.ucl.qualifiersSynced = true;
    }
  }

  function resetAllLeaguesAndDraws() {
    ['pl', 'laliga', 'serieA', 'bundesliga', 'ligue1', 'ligaPortugal', 'eredivisie', 'superLig', 'scottishPrem', 'ucl'].forEach(key => {
      initTournamentState(key);
    });
    syncUclFromLeagues();
    renderActiveTournament();
  }

  function renderUclHomePage(state, container) {
    const feederInfo = getUclFeederStatus();
    
    // Dynamic top qualifiers strictly synced with live tournament points
    const allLiveQualifiers = [];
    feederInfo.feeders.forEach(f => {
      f.top4.forEach(t => {
        allLiveQualifiers.push({
          club: t.club,
          pts: t.pts || 0,
          mp: t.mp || 0,
          league: f.name
        });
      });
    });

    allLiveQualifiers.sort((a, b) => b.pts - a.pts);

    const uclChampionsHonorRoll = [
      { year: '2024', club: 'REAL MADRID', titles: '15', result: '2 - 0 vs Dortmund' },
      { year: '2023', club: 'MAN CITY', titles: '1', result: '1 - 0 vs Inter' },
      { year: '2022', club: 'REAL MADRID', titles: '14', result: '1 - 0 vs Liverpool' },
      { year: '2021', club: 'CHELSEA', titles: '2', result: '1 - 0 vs Man City' },
      { year: '2020', club: 'BAYERN MUNICH', titles: '6', result: '1 - 0 vs PSG' }
    ];

    container.innerHTML = `
      <div class="ucl-showcase-wrapper">
        <div class="ucl-hero" id="ucl-interactive-hero">
          ${renderHeroVideoBgHtml('ucl')}
          ${renderHeroVideoBadgeHtml('ucl')}
          <div class="ucl-hero-overlay"></div>
          <div class="ucl-spotlight-glow" id="ucl-spotlight"></div>

          <div class="ucl-hero-layout">
            <!-- Left: Cyber/Neon Roll of Honor Table (Previous Champions) -->
            <div class="ucl-cyber-card">
              <div class="ucl-cyber-header">
                <span><span class="cyber-sparkle">✦</span> UCL RECENT CHAMPIONS // ROLL OF HONOR <span class="cyber-sparkle">✦</span></span>
                <span style="font-size:0.7rem;color:#00F0FF;letter-spacing:0.5px;">HISTORY</span>
              </div>
              <table class="ucl-cyber-table">
                <thead>
                  <tr>
                    <th style="width:48px;">YEAR</th>
                    <th>CHAMPION</th>
                    <th style="text-align:center;">TITLES</th>
                    <th style="text-align:right;">FINAL RESULT</th>
                  </tr>
                </thead>
                <tbody>
                  ${uclChampionsHonorRoll.map((r, idx) => `
                    <tr>
                      <td class="pos-col" style="font-size:0.8rem;color:#00F0FF;">${r.year}</td>
                      <td class="team-col">
                        <div style="display:flex;align-items:center;gap:8px;">
                          ${getTeamLogoHtml(r.club)}
                          <strong style="letter-spacing:0.04em;">${r.club}</strong>
                          ${idx === 0 ? '<i class="fa-solid fa-crown widget-crown-icon"></i>' : ''}
                        </div>
                      </td>
                      <td style="text-align:center;color:#FFC94A;font-weight:800;font-family:var(--font-hud);">${r.titles} 🏆</td>
                      <td class="pnt-col" style="font-size:0.78rem;color:#E2E8F0;font-weight:600;text-align:right;">${r.result}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <!-- Right: UEFA Champions League Starball & Action -->
            <div class="ucl-hero-right">
              <div class="ucl-starball-badge">
                <i class="fa-solid fa-star"></i>
                <span>UEFA CHAMPIONS LEAGUE</span>
              </div>

              <h1 class="ucl-hero-title">
                THE PINNACLE OF
                <span class="ucl-cyan-glow">EUROPEAN FOOTBALL</span>
              </h1>

              <p class="ucl-hero-desc">
                Where the champions of England, Spain, Italy, and Germany collide.
                32 Elite clubs compete in 8 powerhouse groups and knockout stages to Wembley.
              </p>

              <div class="ucl-hero-actions">
                <button type="button" class="ucl-btn-primary" id="btn-ucl-enter">
                  <span>ENTER TOURNAMENT</span>
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
                <button type="button" class="ucl-btn-secondary" id="btn-ucl-sync">
                  <i class="fa-solid fa-arrows-rotate"></i>
                  <span>SYNC QUALIFIERS</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Lower Section: Domestic Leagues Feeder Hub -->
          <div class="ucl-feeders-container">
            <div class="ucl-feeders-header">
              <div class="ucl-feeders-title">
                <i class="fa-solid fa-sitemap"></i>
                <span>ROAD TO UCL // 16 DIRECT QUALIFICATION SPOTS (${feederInfo.finishedCount}/4 LEAGUES COMPLETED)</span>
              </div>
              <div style="display:flex;align-items:center;gap:10px;">
                ${feederInfo.finishedCount > 0 ? `
                  <button type="button" class="btn-instant-matchday" id="btn-ucl-reset-all" style="font-size:0.75rem;padding:6px 14px;background:rgba(231,76,60,0.18);border:1px solid #E74C3C;color:#FFF;">
                    <i class="fa-solid fa-rotate-left"></i>
                    <span>RESET ALL LEAGUES & DRAWS</span>
                  </button>
                ` : `
                  <span class="data-badge REAL_DATA" style="background:rgba(0,240,255,0.15);color:#00F0FF;border:1px solid #00F0FF;">
                    <i class="fa-solid fa-satellite-dish"></i> LIVE LEAGUE SYNC ACTIVE
                  </span>
                `}
              </div>
            </div>

            <div class="ucl-feeders-grid">
              ${feederInfo.feeders.map(f => `
                <div class="ucl-feeder-card ${f.isFinished ? 'completed' : ''}">
                  <div class="ucl-feeder-card-top">
                    <span class="ucl-feeder-name">${f.flag} ${f.name.toUpperCase()}</span>
                    <span class="ucl-feeder-badge ${f.isFinished ? 'done' : 'pending'}">
                      ${f.isFinished ? '✅ 4/4 CONFIRMED' : (f.curMd > 0 ? `⏳ MD ${f.curMd}/${f.totalMd}` : '⭐ OFFICIAL SEEDS')}
                    </span>
                  </div>
                  <div class="ucl-feeder-teams">
                    ${f.top4.map((t, idx) => `
                      <div class="ucl-qual-team-row ${idx === 0 ? 'pos-1' : ''}">
                        <div class="ucl-qual-team-name">
                          ${getTeamLogoHtml(t.club)}
                          <span>${t.pos || (idx + 1)}. ${t.club.toUpperCase()}</span>
                        </div>
                        <span class="ucl-qual-team-pts">${t.pts} PTS</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

        </div>
      </div>
    `;

    // Event listeners
    const enterBtn = container.querySelector('#btn-ucl-enter');
    if (enterBtn) {
enterBtn.addEventListener('click', () => {
        initTournamentState(activeTournKey);
        syncUclFromLeagues();
        state.subView = 'sim';
        activeStageFilter = 'all';
        renderActiveTournament();
      });
    }

    const syncBtn = container.querySelector('#btn-ucl-sync');
    if (syncBtn) {
      syncBtn.addEventListener('click', () => {
        syncUclFromLeagues();
        renderUclHomePage(state, container);
      });
    }

    const resetBtn = container.querySelector('#btn-ucl-reset-all');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        resetAllLeaguesAndDraws();
      });
    }

    // Dynamic mouse-tracking interactive spotlight
    const heroEl = container.querySelector('#ucl-interactive-hero');
    const spotEl = container.querySelector('#ucl-spotlight');
    if (heroEl && spotEl) {
      heroEl.addEventListener('mousemove', (e) => {
        const rect = heroEl.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        spotEl.style.transform = `translate(${x - 225}px, ${y - 225}px)`;
        spotEl.style.opacity = '1';
      });
      heroEl.addEventListener('mouseleave', () => {
        spotEl.style.opacity = '0';
      });
    }
  }

  function renderLeagueSeasonTable(state, container) {
    const isLaLiga = activeTournKey === 'laliga';
    const isPL = activeTournKey === 'pl';
    const isSerieA = activeTournKey === 'serieA';
    const isBundesliga = activeTournKey === 'bundesliga';
    const isLigue1 = activeTournKey === 'ligue1';
    const isLigaPortugal = activeTournKey === 'ligaPortugal';
    const isEredivisie = activeTournKey === 'eredivisie';
    const isSuperLig = activeTournKey === 'superLig';
    const isScottishPrem = activeTournKey === 'scottishPrem';
    const rows = state.leagueTable || [];
    const matchdays = state.matchdays || [];
    const selectedMdIdx = state.selectedMatchday || 0;
    const currentMdMatches = matchdays[selectedMdIdx] || [];
    const isRoundDone = currentMdMatches.length > 0 && currentMdMatches.every(m => m.isSimulated);

    // Group current matchday matches by Day (Friday -> Monday)
    const dayGroups = {};
    currentMdMatches.forEach((m, idx) => {
      const dayKey = m.day || 'Weekend';
      if (!dayGroups[dayKey]) dayGroups[dayKey] = [];
      dayGroups[dayKey].push({ match: m, idx });
    });

    // ---- Premier League HOME view: full-screen interactive showcase landing page ----
    if (isPL && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="pl-showcase-wrapper">
          <div class="pl-hero" id="pl-interactive-hero">
            ${renderHeroVideoBgHtml('pl')}
            ${renderHeroVideoBadgeHtml('pl')}
            <div class="pl-hero-overlay"></div>
            <div class="pl-spotlight-glow" id="pl-spotlight"></div>

            <div class="pl-hero-layout">
              <div class="pl-hero-left">
                <div class="pl-brand-badge">
                  <span class="pl-lion-icon"><i class="fa-solid fa-shield"></i></span>
                  <span>PREMIER LEAGUE</span>
                  <span class="pl-tag-sub">OFFICIAL BROADCAST</span>
                </div>
                <h1 class="pl-hero-title">
                  THE PINNACLE OF
                  <span class="pl-highlight">ENGLISH FOOTBALL</span>
                </h1>
                <p class="pl-hero-desc">
                  Witness the intensity, the history, and the globally celebrated
                  matches. Stay connected with the Premier League's
                  definitive rankings, fixtures, and club updates.
                </p>
                <div class="pl-hero-actions">
                  <button type="button" class="pl-btn-primary" id="pl-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="pl-btn-secondary" id="pl-btn-explore-teams">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="pl-standings-widget">
                <div class="pl-standings-widget-header">
                  <div class="pl-standings-widget-title">
                    <span class="pl-bracket-accent">|</span>
                    <span>PREMIER LEAGUE <strong>STANDINGS</strong></span>
                  </div>
                  <button type="button" class="pl-standings-view-all" id="pl-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="pl-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'pl-row-pos-1' : (r.pos <= 4 ? 'pl-row-pos-ucl' : (r.pos <= 6 ? 'pl-row-pos-uel' : ''))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="pl-pos-badge ${r.pos === 1 ? 'pl-pos-champion' : (r.pos <= 4 ? 'pl-pos-ucl' : (r.pos <= 6 ? 'pl-pos-uel' : 'pl-pos-mid'))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="pl-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown pl-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="pl-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="pl-stats-ribbon">
              <div class="pl-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved pl-ribbon-icon"></i>
                <div class="pl-ribbon-meta">
                  <span class="pl-ribbon-num">20</span>
                  <span class="pl-ribbon-lbl">TEAMS</span>
                </div>
              </div>
              <div class="pl-ribbon-stat-item">
                <i class="fa-solid fa-trophy pl-ribbon-icon"></i>
                <div class="pl-ribbon-meta">
                  <span class="pl-ribbon-num">380</span>
                  <span class="pl-ribbon-lbl">MATCHES</span>
                </div>
              </div>
              <div class="pl-ribbon-stat-item">
                <i class="fa-regular fa-calendar-days pl-ribbon-icon"></i>
                <div class="pl-ribbon-meta">
                  <span class="pl-ribbon-num">10</span>
                  <span class="pl-ribbon-lbl">MONTHS OF ACTION</span>
                </div>
              </div>
              <div class="pl-ribbon-stat-item">
                <i class="fa-solid fa-users pl-ribbon-icon"></i>
                <div class="pl-ribbon-meta">
                  <span class="pl-ribbon-num">MILLIONS</span>
                  <span class="pl-ribbon-lbl">OF FANS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

// Bind home-view buttons
      const plGoSimBtn = container.querySelector('#pl-btn-go-to-simulation');
      if (plGoSimBtn) {
        plGoSimBtn.addEventListener('click', () => {
          initTournamentState(activeTournKey);
          tournamentState[activeTournKey].subView = 'sim';
          renderActiveTournament();
        });
      }
      const plWvfBtn = container.querySelector('#pl-btn-widget-view-full');
      if (plWvfBtn) {
        plWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const plExpTeamsBtn = container.querySelector('#pl-btn-explore-teams');
      if (plExpTeamsBtn) {
        plExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for PL
      const plHeroEl = container.querySelector('#pl-interactive-hero');
      const plSpotEl = container.querySelector('#pl-spotlight');
      if (plHeroEl && plSpotEl) {
        plHeroEl.addEventListener('mousemove', (e) => {
          const rect = plHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          plSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          plSpotEl.style.opacity = '1';
        });
        plHeroEl.addEventListener('mouseleave', () => {
          plSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Serie A HOME view: full-screen interactive showcase landing page ----
    if (isSerieA && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="seriea-showcase-wrapper">
          <div class="seriea-hero" id="seriea-interactive-hero">
            ${renderHeroVideoBgHtml('serieA')}
            ${renderHeroVideoBadgeHtml('serieA')}
            <div class="seriea-hero-overlay"></div>
            <div class="seriea-spotlight-glow" id="seriea-spotlight"></div>

            <div class="seriea-hero-layout">
              <div class="seriea-hero-left">
                <div class="seriea-brand-badge">
                  <span class="seriea-icon"><i class="fa-solid fa-shield-halved"></i></span>
                  <span>SERIE A ENILIVE</span>
                  <span class="seriea-tag-sub">🇮🇹 OFFICIAL BROADCAST</span>
                </div>
                <h1 class="seriea-hero-title">
                  LA PASSIONE
                  <span class="seriea-highlight">ITALIANA</span>
                </h1>
                <p class="seriea-hero-desc">
                  Where passion meets perfection. Relive the Milan derbies,
                  Rome rivalries, and the relentless chase for the
                  iconic <strong>Scudetto</strong>. Italy's beautiful game, live.
                </p>
                <div class="seriea-hero-actions">
                  <button type="button" class="seriea-btn-primary" id="seriea-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="seriea-btn-secondary" id="seriea-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="seriea-standings-widget">
                <div class="seriea-standings-widget-header">
                  <div class="seriea-standings-widget-title">
                    <span class="seriea-bracket-accent">|</span>
                    <span>SERIE A <strong>CLASSIFICA</strong></span>
                  </div>
                  <button type="button" class="seriea-standings-view-all" id="seriea-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="seriea-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'sa-row-pos-1' : (r.pos <= 4 ? 'sa-row-pos-ucl' : (r.pos <= 6 ? 'sa-row-pos-uel' : ''))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="seriea-pos-badge ${r.pos === 1 ? 'sa-pos-champion' : (r.pos <= 4 ? 'sa-pos-ucl' : (r.pos <= 6 ? 'sa-pos-uel' : 'sa-pos-mid'))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="seriea-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown seriea-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="seriea-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="seriea-stats-ribbon">
              <div class="seriea-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved seriea-ribbon-icon"></i>
                <div class="seriea-ribbon-meta">
                  <span class="seriea-ribbon-num">20</span>
                  <span class="seriea-ribbon-lbl">SQUADRE</span>
                </div>
              </div>
              <div class="seriea-ribbon-stat-item">
                <i class="fa-solid fa-trophy seriea-ribbon-icon"></i>
                <div class="seriea-ribbon-meta">
                  <span class="seriea-ribbon-num">380</span>
                  <span class="seriea-ribbon-lbl">PARTITE</span>
                </div>
              </div>
              <div class="seriea-ribbon-stat-item">
                <i class="fa-solid fa-star seriea-ribbon-icon"></i>
                <div class="seriea-ribbon-meta">
                  <span class="seriea-ribbon-num">SCUDETTO</span>
                  <span class="seriea-ribbon-lbl">IL TROFEO PIÙ AMBITO</span>
                </div>
              </div>
              <div class="seriea-ribbon-stat-item">
                <i class="fa-solid fa-fire seriea-ribbon-icon"></i>
                <div class="seriea-ribbon-meta">
                  <span class="seriea-ribbon-num">DERBY</span>
                  <span class="seriea-ribbon-lbl">MILAN & ROMA</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const saGoSimBtn = container.querySelector('#seriea-btn-go-to-simulation');
      if (saGoSimBtn) {
        saGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const saWvfBtn = container.querySelector('#seriea-btn-widget-view-full');
      if (saWvfBtn) {
        saWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const saExpTeamsBtn = container.querySelector('#seriea-btn-explore-teams');
      if (saExpTeamsBtn) {
        saExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Serie A
      const saHeroEl = container.querySelector('#seriea-interactive-hero');
      const saSpotEl = container.querySelector('#seriea-spotlight');
      if (saHeroEl && saSpotEl) {
        saHeroEl.addEventListener('mousemove', (e) => {
          const rect = saHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          saSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          saSpotEl.style.opacity = '1';
        });
        saHeroEl.addEventListener('mouseleave', () => {
          saSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Bundesliga HOME view: full-screen interactive showcase landing page ----
    if (isBundesliga && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="bundesliga-showcase-wrapper">
          <div class="bundesliga-hero" id="bundesliga-interactive-hero">
            ${renderHeroVideoBgHtml('bundesliga')}
            ${renderHeroVideoBadgeHtml('bundesliga')}
            <div class="bundesliga-hero-overlay"></div>
            <div class="bundesliga-spotlight-glow" id="bundesliga-spotlight"></div>

            <div class="bundesliga-hero-layout">
              <div class="bundesliga-hero-left">
                <div class="bundesliga-brand-badge">
                  <span class="bundesliga-icon"><i class="fa-solid fa-shield"></i></span>
                  <span>BUNDESLIGA</span>
                  <span class="bundesliga-tag-sub">🇩🇪 OFFICIAL BROADCAST</span>
                </div>
                <h1 class="bundesliga-hero-title">
                  FOOTBALL AS IT'S
                  <span class="bundesliga-highlight">MEANT TO BE</span>
                </h1>
                <p class="bundesliga-hero-desc">
                  Pure emotion, electric atmospheres, and relentless attacking football.
                  Follow Germany's elite clubs in the race for the prestigious
                  <strong>Meisterschale</strong> and European glory.
                </p>
                <div class="bundesliga-hero-actions">
                  <button type="button" class="bundesliga-btn-primary" id="bundesliga-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="bundesliga-btn-secondary" id="bundesliga-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="bundesliga-standings-widget">
                <div class="bundesliga-standings-widget-header">
                  <div class="bundesliga-standings-widget-title">
                    <span class="bundesliga-bracket-accent">|</span>
                    <span>BUNDESLIGA <strong>TABELLE</strong></span>
                  </div>
                  <button type="button" class="bundesliga-standings-view-all" id="bundesliga-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="bundesliga-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'bl-row-pos-1' : (r.pos <= 4 ? 'bl-row-pos-ucl' : (r.pos <= 6 ? 'bl-row-pos-uel' : ''))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="bundesliga-pos-badge ${r.pos === 1 ? 'bl-pos-champion' : (r.pos <= 4 ? 'bl-pos-ucl' : (r.pos <= 6 ? 'bl-pos-uel' : 'bl-pos-mid'))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="bundesliga-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown bundesliga-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="bundesliga-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="bundesliga-stats-ribbon">
              <div class="bundesliga-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved bundesliga-ribbon-icon"></i>
                <div class="bundesliga-ribbon-meta">
                  <span class="bundesliga-ribbon-num">18</span>
                  <span class="bundesliga-ribbon-lbl">CLUBS</span>
                </div>
              </div>
              <div class="bundesliga-ribbon-stat-item">
                <i class="fa-solid fa-trophy bundesliga-ribbon-icon"></i>
                <div class="bundesliga-ribbon-meta">
                  <span class="bundesliga-ribbon-num">306</span>
                  <span class="bundesliga-ribbon-lbl">MATCHES</span>
                </div>
              </div>
              <div class="bundesliga-ribbon-stat-item">
                <i class="fa-solid fa-award bundesliga-ribbon-icon"></i>
                <div class="bundesliga-ribbon-meta">
                  <span class="bundesliga-ribbon-num">MEISTERSCHALE</span>
                  <span class="bundesliga-ribbon-lbl">TITLE TROPHY</span>
                </div>
              </div>
              <div class="bundesliga-ribbon-stat-item">
                <i class="fa-solid fa-fire bundesliga-ribbon-icon"></i>
                <div class="bundesliga-ribbon-meta">
                  <span class="bundesliga-ribbon-num">DER KLASSIKER</span>
                  <span class="bundesliga-ribbon-lbl">RIVALRY</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const blGoSimBtn = container.querySelector('#bundesliga-btn-go-to-simulation');
      if (blGoSimBtn) {
        blGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const blWvfBtn = container.querySelector('#bundesliga-btn-widget-view-full');
      if (blWvfBtn) {
        blWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const blExpTeamsBtn = container.querySelector('#bundesliga-btn-explore-teams');
      if (blExpTeamsBtn) {
        blExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Bundesliga
      const blHeroEl = container.querySelector('#bundesliga-interactive-hero');
      const blSpotEl = container.querySelector('#bundesliga-spotlight');
      if (blHeroEl && blSpotEl) {
        blHeroEl.addEventListener('mousemove', (e) => {
          const rect = blHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          blSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          blSpotEl.style.opacity = '1';
        });
        blHeroEl.addEventListener('mouseleave', () => {
          blSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Ligue 1 HOME view: full-screen interactive showcase landing page ----
    if (isLigue1 && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="ligue1-showcase-wrapper">
          <div class="ligue1-hero" id="ligue1-interactive-hero">
            ${renderHeroVideoBgHtml('ligue1')}
            ${renderHeroVideoBadgeHtml('ligue1')}
            <div class="ligue1-hero-overlay"></div>
            <div class="ligue1-spotlight-glow" id="ligue1-spotlight"></div>

            <div class="ligue1-hero-layout">
              <div class="ligue1-hero-left">
                <div class="ligue1-brand-badge">
                  <span class="ligue1-icon"><i class="fa-solid fa-trophy"></i></span>
                  <span>LIGUE 1 MCDONALD’S</span>
                  <span class="ligue1-tag-sub">🇫🇷 OFFICIAL BROADCAST</span>
                </div>
                <h1 class="ligue1-hero-title">
                  LE FOOTBALL
                  <span class="ligue1-highlight">DES TALENTS</span>
                </h1>
                <p class="ligue1-hero-desc">
                  Where brilliance meets passion. Follow French football's finest clubs,
                  the fever of <strong>Le Classique</strong>, and the intense pursuit of the
                  revered <strong>Hexagoal</strong> championship trophy.
                </p>
                <div class="ligue1-hero-actions">
                  <button type="button" class="ligue1-btn-primary" id="ligue1-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="ligue1-btn-secondary" id="ligue1-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="ligue1-standings-widget">
                <div class="ligue1-standings-widget-header">
                  <div class="ligue1-standings-widget-title">
                    <span class="ligue1-bracket-accent">|</span>
                    <span>CLASSEMENT <strong>LIGUE 1</strong></span>
                  </div>
                  <button type="button" class="ligue1-standings-view-all" id="ligue1-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="ligue1-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'l1-row-pos-1' : (r.pos <= 3 ? 'l1-row-pos-ucl' : (r.pos === 4 ? 'l1-row-pos-ucl-q' : (r.pos <= 6 ? 'l1-row-pos-uel' : '')))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="ligue1-pos-badge ${r.pos === 1 ? 'l1-pos-champion' : (r.pos <= 3 ? 'l1-pos-ucl' : (r.pos === 4 ? 'l1-pos-ucl-q' : (r.pos <= 6 ? 'l1-pos-uel' : 'l1-pos-mid')))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="ligue1-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown ligue1-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="ligue1-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="ligue1-stats-ribbon">
              <div class="ligue1-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved ligue1-ribbon-icon"></i>
                <div class="ligue1-ribbon-meta">
                  <span class="ligue1-ribbon-num">18</span>
                  <span class="ligue1-ribbon-lbl">CLUBS</span>
                </div>
              </div>
              <div class="ligue1-ribbon-stat-item">
                <i class="fa-solid fa-trophy ligue1-ribbon-icon"></i>
                <div class="ligue1-ribbon-meta">
                  <span class="ligue1-ribbon-num">306</span>
                  <span class="ligue1-ribbon-lbl">MATCHES</span>
                </div>
              </div>
              <div class="ligue1-ribbon-stat-item">
                <i class="fa-solid fa-award ligue1-ribbon-icon"></i>
                <div class="ligue1-ribbon-meta">
                  <span class="ligue1-ribbon-num">HEXAGOAL</span>
                  <span class="ligue1-ribbon-lbl">CHAMPIONNAT</span>
                </div>
              </div>
              <div class="ligue1-ribbon-stat-item">
                <i class="fa-solid fa-fire ligue1-ribbon-icon"></i>
                <div class="ligue1-ribbon-meta">
                  <span class="ligue1-ribbon-num">LE CLASSIQUE</span>
                  <span class="ligue1-ribbon-lbl">PSG VS OM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const l1GoSimBtn = container.querySelector('#ligue1-btn-go-to-simulation');
      if (l1GoSimBtn) {
        l1GoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const l1WvfBtn = container.querySelector('#ligue1-btn-widget-view-full');
      if (l1WvfBtn) {
        l1WvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const l1ExpTeamsBtn = container.querySelector('#ligue1-btn-explore-teams');
      if (l1ExpTeamsBtn) {
        l1ExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Ligue 1
      const l1HeroEl = container.querySelector('#ligue1-interactive-hero');
      const l1SpotEl = container.querySelector('#ligue1-spotlight');
      if (l1HeroEl && l1SpotEl) {
        l1HeroEl.addEventListener('mousemove', (e) => {
          const rect = l1HeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          l1SpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          l1SpotEl.style.opacity = '1';
        });
        l1HeroEl.addEventListener('mouseleave', () => {
          l1SpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Liga Portugal HOME view: full-screen interactive showcase landing page ----
    if (isLigaPortugal && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="ligaportugal-showcase-wrapper">
          <div class="ligaportugal-hero" id="ligaportugal-interactive-hero">
            ${renderHeroVideoBgHtml('ligaPortugal')}
            ${renderHeroVideoBadgeHtml('ligaPortugal')}
            <div class="ligaportugal-hero-overlay"></div>
            <div class="ligaportugal-spotlight-glow" id="ligaportugal-spotlight"></div>

            <div class="ligaportugal-hero-layout">
              <div class="ligaportugal-hero-left">
                <div class="ligaportugal-brand-badge">
                  <span class="ligaportugal-icon"><i class="fa-solid fa-shield-halved"></i></span>
                  <span>LIGA PORTUGAL BETCLIC</span>
                  <span class="ligaportugal-tag-sub">🇵🇹 OFFICIAL BROADCAST</span>
                </div>
                <h1 class="ligaportugal-hero-title">
                  A PAIXÃO DO
                  <span class="ligaportugal-highlight">FUTEBOL PORTUGUÊS</span>
                </h1>
                <p class="ligaportugal-hero-desc">
                  Pure emotion, vibrant intensity, and the legendary battles between
                  <strong>Os Três Grandes</strong>. Follow Portugal's top clubs in the race
                  for the prestigious <strong>Taça de Campeão</strong>.
                </p>
                <div class="ligaportugal-hero-actions">
                  <button type="button" class="ligaportugal-btn-primary" id="ligaportugal-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="ligaportugal-btn-secondary" id="ligaportugal-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="ligaportugal-standings-widget">
                <div class="ligaportugal-standings-widget-header">
                  <div class="ligaportugal-standings-widget-title">
                    <span class="ligaportugal-bracket-accent">|</span>
                    <span>CLASSIFICAÇÃO <strong>ATUAL</strong></span>
                  </div>
                  <button type="button" class="ligaportugal-standings-view-all" id="ligaportugal-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="ligaportugal-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUBE</th>
                      <th>J</th>
                      <th>V</th>
                      <th>E</th>
                      <th>D</th>
                      <th>DG</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'lp-row-pos-1' : (r.pos <= 2 ? 'lp-row-pos-ucl' : (r.pos === 3 ? 'lp-row-pos-ucl-q' : (r.pos <= 5 ? 'lp-row-pos-uel' : '')))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="ligaportugal-pos-badge ${r.pos === 1 ? 'lp-pos-champion' : (r.pos <= 2 ? 'lp-pos-ucl' : (r.pos === 3 ? 'lp-pos-ucl-q' : (r.pos <= 5 ? 'lp-pos-uel' : 'lp-pos-mid')))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="ligaportugal-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown ligaportugal-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="ligaportugal-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="ligaportugal-stats-ribbon">
              <div class="ligaportugal-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved ligaportugal-ribbon-icon"></i>
                <div class="ligaportugal-ribbon-meta">
                  <span class="ligaportugal-ribbon-num">18</span>
                  <span class="ligaportugal-ribbon-lbl">CLUBES</span>
                </div>
              </div>
              <div class="ligaportugal-ribbon-stat-item">
                <i class="fa-solid fa-trophy ligaportugal-ribbon-icon"></i>
                <div class="ligaportugal-ribbon-meta">
                  <span class="ligaportugal-ribbon-num">306</span>
                  <span class="ligaportugal-ribbon-lbl">JOGOS</span>
                </div>
              </div>
              <div class="ligaportugal-ribbon-stat-item">
                <i class="fa-solid fa-star ligaportugal-ribbon-icon"></i>
                <div class="ligaportugal-ribbon-meta">
                  <span class="ligaportugal-ribbon-num">TRÊS GRANDES</span>
                  <span class="ligaportugal-ribbon-lbl">BENFICA · SPORTING · PORTO</span>
                </div>
              </div>
              <div class="ligaportugal-ribbon-stat-item">
                <i class="fa-solid fa-award ligaportugal-ribbon-icon"></i>
                <div class="ligaportugal-ribbon-meta">
                  <span class="ligaportugal-ribbon-num">CAMPEÃO</span>
                  <span class="ligaportugal-ribbon-lbl">TAÇA DE PORTUGAL</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const lpGoSimBtn = container.querySelector('#ligaportugal-btn-go-to-simulation');
      if (lpGoSimBtn) {
        lpGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const lpWvfBtn = container.querySelector('#ligaportugal-btn-widget-view-full');
      if (lpWvfBtn) {
        lpWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const lpExpTeamsBtn = container.querySelector('#ligaportugal-btn-explore-teams');
      if (lpExpTeamsBtn) {
        lpExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Liga Portugal
      const lpHeroEl = container.querySelector('#ligaportugal-interactive-hero');
      const lpSpotEl = container.querySelector('#ligaportugal-spotlight');
      if (lpHeroEl && lpSpotEl) {
        lpHeroEl.addEventListener('mousemove', (e) => {
          const rect = lpHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          lpSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          lpSpotEl.style.opacity = '1';
        });
        lpHeroEl.addEventListener('mouseleave', () => {
          lpSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Eredivisie HOME view: full-screen interactive showcase landing page ----
    if (isEredivisie && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="eredivisie-showcase-wrapper">
          <div class="eredivisie-hero" id="eredivisie-interactive-hero">
            ${renderHeroVideoBgHtml('eredivisie')}
            ${renderHeroVideoBadgeHtml('eredivisie')}
            <div class="eredivisie-hero-overlay"></div>
            <div class="eredivisie-spotlight-glow" id="eredivisie-spotlight"></div>

            <div class="eredivisie-hero-layout">
              <div class="eredivisie-hero-left">
                <div class="eredivisie-brand-badge">
                  <span class="eredivisie-icon"><i class="fa-solid fa-circle-dot"></i></span>
                  <span>EREDIVISIE</span>
                  <span class="eredivisie-tag-sub">🇳🇱 OFFICIAL BROADCAST</span>
                </div>
                <h1 class="eredivisie-hero-title">
                  HET THEATER VAN
                  <span class="eredivisie-highlight">HET NEDERLANDSE VOETBAL</span>
                </h1>
                <p class="eredivisie-hero-desc">
                  Pure attacking football, young virtuosos, and electrifying rivalries.
                  Follow the dramatic race between Ajax, PSV, and Feyenoord for the
                  distinguished <strong>Kampioensschaal</strong>.
                </p>
                <div class="eredivisie-hero-actions">
                  <button type="button" class="eredivisie-btn-primary" id="eredivisie-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="eredivisie-btn-secondary" id="eredivisie-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="eredivisie-standings-widget">
                <div class="eredivisie-standings-widget-header">
                  <div class="eredivisie-standings-widget-title">
                    <span class="eredivisie-bracket-accent">|</span>
                    <span>STAND <strong>EREDIVISIE</strong></span>
                  </div>
                  <button type="button" class="eredivisie-standings-view-all" id="eredivisie-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="eredivisie-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>W</th>
                      <th>G</th>
                      <th>V</th>
                      <th>DS</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'ed-row-pos-1' : (r.pos <= 2 ? 'ed-row-pos-ucl' : (r.pos === 3 ? 'ed-row-pos-ucl-q' : (r.pos <= 4 ? 'ed-row-pos-uel' : '')))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="eredivisie-pos-badge ${r.pos === 1 ? 'ed-pos-champion' : (r.pos <= 2 ? 'ed-pos-ucl' : (r.pos === 3 ? 'ed-pos-ucl-q' : (r.pos <= 4 ? 'ed-pos-uel' : 'ed-pos-mid')))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="eredivisie-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown eredivisie-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="eredivisie-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="eredivisie-stats-ribbon">
              <div class="eredivisie-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved eredivisie-ribbon-icon"></i>
                <div class="eredivisie-ribbon-meta">
                  <span class="eredivisie-ribbon-num">18</span>
                  <span class="eredivisie-ribbon-lbl">CLUBS</span>
                </div>
              </div>
              <div class="eredivisie-ribbon-stat-item">
                <i class="fa-solid fa-trophy eredivisie-ribbon-icon"></i>
                <div class="eredivisie-ribbon-meta">
                  <span class="eredivisie-ribbon-num">306</span>
                  <span class="eredivisie-ribbon-lbl">WEDSTRIJDEN</span>
                </div>
              </div>
              <div class="eredivisie-ribbon-stat-item">
                <i class="fa-solid fa-fire eredivisie-ribbon-icon"></i>
                <div class="eredivisie-ribbon-meta">
                  <span class="eredivisie-ribbon-num">DE KLASSIEKER</span>
                  <span class="eredivisie-ribbon-lbl">AJAX VS FEYENOORD</span>
                </div>
              </div>
              <div class="eredivisie-ribbon-stat-item">
                <i class="fa-solid fa-award eredivisie-ribbon-icon"></i>
                <div class="eredivisie-ribbon-meta">
                  <span class="eredivisie-ribbon-num">KAMPIOENSSCHAAL</span>
                  <span class="eredivisie-ribbon-lbl">TITEL TROFEE</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const edGoSimBtn = container.querySelector('#eredivisie-btn-go-to-simulation');
      if (edGoSimBtn) {
        edGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const edWvfBtn = container.querySelector('#eredivisie-btn-widget-view-full');
      if (edWvfBtn) {
        edWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const edExpTeamsBtn = container.querySelector('#eredivisie-btn-explore-teams');
      if (edExpTeamsBtn) {
        edExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Eredivisie
      const edHeroEl = container.querySelector('#eredivisie-interactive-hero');
      const edSpotEl = container.querySelector('#eredivisie-spotlight');
      if (edHeroEl && edSpotEl) {
        edHeroEl.addEventListener('mousemove', (e) => {
          const rect = edHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          edSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          edSpotEl.style.opacity = '1';
        });
        edHeroEl.addEventListener('mouseleave', () => {
          edSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Trendyol Süper Lig HOME view: full-screen interactive showcase landing page ----
    if (isSuperLig && state.subView !== 'sim') {
      const top10 = rows.slice(0, 10);
      container.innerHTML = `
        <div class="superlig-showcase-wrapper">
          <div class="superlig-hero" id="superlig-interactive-hero">
            ${renderHeroVideoBgHtml('superLig')}
            ${renderHeroVideoBadgeHtml('superLig')}
            <div class="superlig-hero-overlay"></div>
            <div class="superlig-spotlight-glow" id="superlig-spotlight"></div>

            <div class="superlig-hero-layout">
              <div class="superlig-hero-left">
                <div class="superlig-brand-badge">
                  <span class="superlig-icon"><i class="fa-solid fa-fire-flame-curved"></i></span>
                  <span>TRENDYOL SÜPER LİG</span>
                  <span class="superlig-tag-sub">🇹🇷 RESMÎ YAYIN</span>
                </div>
                <h1 class="superlig-hero-title">
                  TÜRK FUTBOLUNUN
                  <span class="superlig-highlight">BÜYÜK TUTKUSU</span>
                </h1>
                <p class="superlig-hero-desc">
                  Fiery derbies, pulsating atmospheres, and unyielding passion.
                  Witness the legendary rivalry of Galatasaray, Fenerbahçe, and Beşiktaş
                  in the fierce battle for the <strong>Süper Lig Kupası</strong>.
                </p>
                <div class="superlig-hero-actions">
                  <button type="button" class="superlig-btn-primary" id="superlig-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>FİKSTÜRÜ GÖR</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="superlig-btn-secondary" id="superlig-btn-explore-teams">
                    <i class="fa-solid fa-futbol"></i>
                    <span>KULÜPLER</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="superlig-standings-widget">
                <div class="superlig-standings-widget-header">
                  <div class="superlig-standings-widget-title">
                    <span class="superlig-bracket-accent">|</span>
                    <span>SÜPER LİG <strong>PUAN DURUMU</strong></span>
                  </div>
                  <button type="button" class="superlig-standings-view-all" id="superlig-btn-widget-view-full">
                    <span>TÜM TABLO</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="superlig-widget-table">
                  <thead>
                    <tr>
                      <th>SIRA</th>
                      <th>KULÜP</th>
                      <th>O</th>
                      <th>G</th>
                      <th>B</th>
                      <th>M</th>
                      <th>AV</th>
                      <th>P</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top10.map(r => `
                      <tr class="${r.pos === 1 ? 'sl-row-pos-1' : (r.pos <= 2 ? 'sl-row-pos-ucl' : (r.pos === 3 ? 'sl-row-pos-uel' : (r.pos === 4 ? 'sl-row-pos-uecl' : '')))}"
                          style="animation: fadeIn 0.3s ease ${(r.pos - 1) * 0.05}s both">
                        <td>
                          <span class="superlig-pos-badge ${r.pos === 1 ? 'sl-pos-champion' : (r.pos <= 2 ? 'sl-pos-ucl' : (r.pos === 3 ? 'sl-pos-uel' : (r.pos === 4 ? 'sl-pos-uecl' : 'sl-pos-mid')))}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="superlig-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown superlig-widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="superlig-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="superlig-stats-ribbon">
              <div class="superlig-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved superlig-ribbon-icon"></i>
                <div class="superlig-ribbon-meta">
                  <span class="superlig-ribbon-num">19</span>
                  <span class="superlig-ribbon-lbl">KULÜP</span>
                </div>
              </div>
              <div class="superlig-ribbon-stat-item">
                <i class="fa-solid fa-trophy superlig-ribbon-icon"></i>
                <div class="superlig-ribbon-meta">
                  <span class="superlig-ribbon-num">380</span>
                  <span class="superlig-ribbon-lbl">MAÇ</span>
                </div>
              </div>
              <div class="superlig-ribbon-stat-item">
                <i class="fa-solid fa-fire superlig-ribbon-icon"></i>
                <div class="superlig-ribbon-meta">
                  <span class="superlig-ribbon-num">KITALARARASI</span>
                  <span class="superlig-ribbon-lbl">DERBİ ATEŞİ</span>
                </div>
              </div>
              <div class="superlig-ribbon-stat-item">
                <i class="fa-solid fa-award superlig-ribbon-icon"></i>
                <div class="superlig-ribbon-meta">
                  <span class="superlig-ribbon-num">ŞAMPİYONLUK</span>
                  <span class="superlig-ribbon-lbl">SÜPER LİG KUPASI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const slGoSimBtn = container.querySelector('#superlig-btn-go-to-simulation');
      if (slGoSimBtn) {
        slGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const slWvfBtn = container.querySelector('#superlig-btn-widget-view-full');
      if (slWvfBtn) {
        slWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const slExpTeamsBtn = container.querySelector('#superlig-btn-explore-teams');
      if (slExpTeamsBtn) {
        slExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Trendyol Super Lig
      const slHeroEl = container.querySelector('#superlig-interactive-hero');
      const slSpotEl = container.querySelector('#superlig-spotlight');
      if (slHeroEl && slSpotEl) {
        slHeroEl.addEventListener('mousemove', (e) => {
          const rect = slHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          slSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          slSpotEl.style.opacity = '1';
        });
        slHeroEl.addEventListener('mouseleave', () => {
          slSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- Scottish Premiership HOME view: full-screen interactive showcase landing page ----
    if (isScottishPrem && state.subView !== 'sim') {
      const top6 = rows.slice(0, 6);
      container.innerHTML = `
        <div class="scottishprem-showcase-wrapper">
          <div class="scottishprem-hero" id="scottishprem-interactive-hero">
            ${renderHeroVideoBgHtml('scottishPrem')}
            ${renderHeroVideoBadgeHtml('scottishPrem')}
            <div class="scottishprem-hero-overlay"></div>
            <div class="scottishprem-spotlight-glow" id="scottishprem-spotlight"></div>

            <div class="scottishprem-hero-layout">
              <div class="scottishprem-hero-left">
                <div class="scottishprem-brand-badge">
                  <span><i class="fa-solid fa-shield"></i></span>
                  <span>SCOTTISH PREMIERSHIP</span>
                  <span class="scottishprem-tag-sub">OFFICIAL BROADCAST</span>
                </div>
                <h1 class="scottishprem-hero-title">
                  PASSION, PRIDE &
                  <span class="scottishprem-highlight">SCOTTISH GLORY</span>
                </h1>
                <p class="scottishprem-hero-desc">
                  Experience fierce rivalries, legendary Old Firm derbies, and the historic battle for the Scottish crown.
                  Simulate every matchday with live standings and European qualification race.
                </p>
                <div class="scottishprem-hero-actions">
                  <button type="button" class="scottishprem-btn-primary" id="scottishprem-btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="scottishprem-btn-secondary" id="scottishprem-btn-explore-teams">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="scottishprem-standings-widget">
                <div class="scottishprem-standings-widget-header">
                  <div class="scottishprem-standings-widget-title">
                    <span>SCOTTISH PREMIERSHIP <strong>STANDINGS</strong></span>
                  </div>
                  <button type="button" class="scottishprem-standings-view-all" id="scottishprem-btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="scottishprem-widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top6.map(r => `
                      <tr class="${r.pos === 1 ? 'row-pos-1' : (r.pos <= 2 ? 'row-pos-ucl' : '')}">
                        <td>
                          <span class="pos-badge ${r.pos === 1 ? 'pos-champion' : (r.pos <= 2 ? 'pos-ucl' : 'pos-uel')}">${r.pos}</span>
                        </td>
                        <td>
                          <div class="scottishprem-widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="scottishprem-widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="scottishprem-stats-ribbon">
              <div class="scottishprem-ribbon-stat-item">
                <i class="fa-solid fa-shield-halved scottishprem-ribbon-icon"></i>
                <div class="scottishprem-ribbon-meta">
                  <span class="scottishprem-ribbon-num">12</span>
                  <span class="scottishprem-ribbon-lbl">PREMIERSHIP CLUBS</span>
                </div>
              </div>
              <div class="scottishprem-ribbon-stat-item">
                <i class="fa-solid fa-trophy scottishprem-ribbon-icon"></i>
                <div class="scottishprem-ribbon-meta">
                  <span class="scottishprem-ribbon-num">228</span>
                  <span class="scottishprem-ribbon-lbl">MATCHES PER SEASON</span>
                </div>
              </div>
              <div class="scottishprem-ribbon-stat-item">
                <i class="fa-solid fa-fire scottishprem-ribbon-icon"></i>
                <div class="scottishprem-ribbon-meta">
                  <span class="scottishprem-ribbon-num">OLD FIRM</span>
                  <span class="scottishprem-ribbon-lbl">DERBY INTENSITY</span>
                </div>
              </div>
              <div class="scottishprem-ribbon-stat-item">
                <i class="fa-solid fa-star scottishprem-ribbon-icon"></i>
                <div class="scottishprem-ribbon-meta">
                  <span class="scottishprem-ribbon-num">UEFA</span>
                  <span class="scottishprem-ribbon-lbl">EUROPEAN SPOTS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

      // Bind home-view buttons
      const spGoSimBtn = container.querySelector('#scottishprem-btn-go-to-simulation');
      if (spGoSimBtn) {
        spGoSimBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const spWvfBtn = container.querySelector('#scottishprem-btn-widget-view-full');
      if (spWvfBtn) {
        spWvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const spExpTeamsBtn = container.querySelector('#scottishprem-btn-explore-teams');
      if (spExpTeamsBtn) {
        spExpTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for Scottish Premiership
      const spHeroEl = container.querySelector('#scottishprem-interactive-hero');
      const spSpotEl = container.querySelector('#scottishprem-spotlight');
      if (spHeroEl && spSpotEl) {
        spHeroEl.addEventListener('mousemove', (e) => {
          const rect = spHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          spSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          spSpotEl.style.opacity = '1';
        });
        spHeroEl.addEventListener('mouseleave', () => {
          spSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // ---- LaLiga HOME view: full-screen interactive showcase landing page ----
    if (isLaLiga && state.subView !== 'sim') {
      const top6 = rows.slice(0, 6);
      container.innerHTML = `
        <div class="laliga-showcase-wrapper">
          <div class="laliga-hero" id="laliga-interactive-hero">
            ${renderHeroVideoBgHtml('laliga')}
            ${renderHeroVideoBadgeHtml('laliga')}
            <div class="laliga-hero-overlay"></div>
            <div class="laliga-spotlight-glow" id="laliga-spotlight"></div>

            <div class="laliga-hero-layout">
              <div class="laliga-hero-left">
                <div class="laliga-brand-badge">
                  <span class="ll-symbol"><i class="fa-solid fa-futbol"></i></span>
                  <span>LALIGA EA SPORTS</span>
                  <span class="laliga-tag-sub">OFFICIAL BROADCAST</span>
                </div>
                <h1 class="laliga-hero-title">
                  THE HEART OF
                  <span class="laliga-highlight">SPANISH FOOTBALL</span>
                </h1>
                <p class="laliga-hero-desc">
                  Experience the passion, the rivalries, and the glory of the best league on earth.
                  Simulate every matchday with real-time match engines and live standings.
                </p>
                <div class="laliga-hero-actions">
                  <button type="button" class="laliga-btn-primary" id="btn-go-to-simulation">
                    <i class="fa-solid fa-bolt"></i>
                    <span>GO TO SIMULATION</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                  <button type="button" class="laliga-btn-secondary" id="btn-explore-teams">
                    <i class="fa-solid fa-shield-halved"></i>
                    <span>EXPLORE TEAMS</span>
                  </button>
                </div>
              </div>

              <!-- Floating Standings Widget -->
              <div class="laliga-standings-widget">
                <div class="standings-widget-header">
                  <div class="standings-widget-title">
                    <span class="bracket-accent">[</span>
                    <span>LALIGA STANDINGS</span>
                  </div>
                  <button type="button" class="standings-view-all" id="btn-widget-view-full">
                    <span>VIEW FULL TABLE</span>
                    <i class="fa-solid fa-chevron-right"></i>
                  </button>
                </div>
                <table class="widget-table">
                  <thead>
                    <tr>
                      <th>POS</th>
                      <th>CLUB</th>
                      <th>P</th>
                      <th>W</th>
                      <th>D</th>
                      <th>L</th>
                      <th>GD</th>
                      <th>PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${top6.map(r => `
                      <tr class="${r.pos === 1 ? 'row-pos-1' : (r.pos <= 4 ? 'row-pos-ucl' : '')}">
                        <td>
                          <span class="pos-badge ${r.pos === 1 ? 'pos-champion' : (r.pos <= 4 ? 'pos-ucl' : 'pos-uel')}">
                            ${r.pos}
                          </span>
                        </td>
                        <td>
                          <div class="widget-club-cell">
                            ${getTeamLogoHtml(r.club)}
                            <span>${r.club.toUpperCase()}</span>
                            ${r.pos === 1 ? '<i class="fa-solid fa-crown widget-crown-icon"></i>' : ''}
                          </div>
                        </td>
                        <td>${r.mp}</td>
                        <td>${r.w}</td>
                        <td>${r.d}</td>
                        <td>${r.l}</td>
                        <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
                        <td class="widget-pts-cell">${r.pts}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Stats Ribbon Bar -->
            <div class="laliga-stats-ribbon">
              <div class="ribbon-stat-item">
                <i class="fa-solid fa-shield-halved ribbon-icon"></i>
                <div class="ribbon-meta">
                  <span class="ribbon-num">20</span>
                  <span class="ribbon-lbl">TEAMS</span>
                </div>
              </div>
              <div class="ribbon-stat-item">
                <i class="fa-solid fa-trophy ribbon-icon"></i>
                <div class="ribbon-meta">
                  <span class="ribbon-num">380</span>
                  <span class="ribbon-lbl">MATCHES</span>
                </div>
              </div>
              <div class="ribbon-stat-item">
                <i class="fa-regular fa-calendar-days ribbon-icon"></i>
                <div class="ribbon-meta">
                  <span class="ribbon-num">10</span>
                  <span class="ribbon-lbl">MONTHS OF ACTION</span>
                </div>
              </div>
              <div class="ribbon-stat-item">
                <i class="fa-solid fa-users ribbon-icon"></i>
                <div class="ribbon-meta">
                  <span class="ribbon-num">MILLIONS</span>
                  <span class="ribbon-lbl">OF FANS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;

// Bind home-view buttons
      const goSimBtn = container.querySelector('#btn-go-to-simulation');
      if (goSimBtn) {
        goSimBtn.addEventListener('click', () => {
          initTournamentState(activeTournKey);
          tournamentState[activeTournKey].subView = 'sim';
          renderActiveTournament();
        });
      }
      const wvfBtn = container.querySelector('#btn-widget-view-full');
      if (wvfBtn) {
        wvfBtn.addEventListener('click', () => {
          state.subView = 'sim';
          renderActiveTournament();
        });
      }
      const expTeamsBtn = container.querySelector('#btn-explore-teams');
      if (expTeamsBtn) {
        expTeamsBtn.addEventListener('click', () => switchView('standings-view'));
      }

      // Dynamic mouse-tracking interactive spotlight for LaLiga
      const llHeroEl = container.querySelector('#laliga-interactive-hero');
      const llSpotEl = container.querySelector('#laliga-spotlight');
      if (llHeroEl && llSpotEl) {
        llHeroEl.addEventListener('mousemove', (e) => {
          const rect = llHeroEl.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          llSpotEl.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
          llSpotEl.style.opacity = '1';
        });
        llHeroEl.addEventListener('mouseleave', () => {
          llSpotEl.style.opacity = '0';
        });
      }

      return; // stop here — don't render simulator below
    }

    // Matchday Navigation Pills (Matchday 1 to 38)
    const isMdUnlocked = isMatchdayUnlocked(state, selectedMdIdx);
    const firstPendingIdx = getFirstPendingMatchdayIdx(state);

    const matchdayPillsHtml = matchdays.map((round, rIdx) => {
      const isSelected = rIdx === selectedMdIdx;
      const isDone = round.every(m => m.isSimulated);
      const isPillUnlocked = isMatchdayUnlocked(state, rIdx);
      const pillAnimClass = isDone ? 'pill-completed-animate' : '';
      let statusIcon = '';
      let lockClass = '';
      if (!isPillUnlocked) {
        statusIcon = '<i class="fa-solid fa-lock" style="font-size:0.65rem;margin-right:4px;opacity:0.75;"></i>';
        lockClass = 'locked';
      } else if (isDone) {
        statusIcon = ' ✓';
      }
      return `
        <button type="button" class="md-pill ${isSelected ? 'active' : ''} ${pillAnimClass} ${isDone ? 'completed' : ''} ${lockClass}" data-md="${rIdx}" title="${!isPillUnlocked ? `Matchday ${rIdx + 1} is locked. Complete Matchday ${firstPendingIdx + 1} first.` : `Matchday ${rIdx + 1}`}">
          ${statusIcon}MATCHDAY ${rIdx + 1}
        </button>
      `;
    }).join('');


// Animate completed matchday pills
    document.querySelectorAll('.md-pill.completed').forEach(pill => {
      pill.classList.add('pill-completed-animate');
    });

    // Render multi-day schedule groups
    const dayScheduleHtml = Object.keys(dayGroups).map(dayName => {
      const dayMatches = dayGroups[dayName];
      const matchCardsHtml = dayMatches.map(({ match: m, idx: mIdx }) => {
        const homeScore = m.isSimulated ? m.scoreHome : (m.isLive ? m.currentDisplayScoreHome : '–');
        const awayScore = m.isSimulated ? m.scoreAway : (m.isLive ? m.currentDisplayScoreAway : '–');
        const isWinnerHome = m.isSimulated && m.scoreHome > m.scoreAway;
        const isWinnerAway = m.isSimulated && m.scoreAway > m.scoreHome;

        const curMin = m.isLive ? (m.currentSimMinute || 0) : 90;
        const liveEvents = (m.events || []).filter(e => m.isSimulated || (m.isLive && e.minute <= curMin));
        const hasEvents = (m.isSimulated || m.isLive) && liveEvents.length > 0;

        let timerHtml = '';
        if (m.isLive) {
          const pct = Math.min(100, Math.round((curMin / 90) * 100));
          timerHtml = `
            <div class="card-live-timer">
              <div class="card-live-header">
                <span>🔴 LIVE SIMULATION • ${curMin <= 45 ? '1ST HALF' : '2ND HALF'}</span>
                <span>⏱ ${curMin}'</span>
              </div>
              <div class="card-live-progress">
                <div class="card-live-progress-fill" style="width: ${pct}%"></div>
              </div>
            </div>
          `;
        }

        let eventsHtml = '';
        if (hasEvents) {
          const homeEvents = liveEvents.filter(e => e.team === 'home');
          const awayEvents = liveEvents.filter(e => e.team === 'away');
          eventsHtml = `
            <div class="match-events-list">
              ${homeEvents.length ? `<div class="match-event-row"><span class="event-team">${m.home}:</span> <span class="event-player">${homeEvents.map(e => `${e.player} ${e.minute}'`).join(', ')}</span></div>` : ''}
              ${awayEvents.length ? `<div class="match-event-row"><span class="event-team">${m.away}:</span> <span class="event-player">${awayEvents.map(e => `${e.player} ${e.minute}'`).join(', ')}</span></div>` : ''}
            </div>
          `;
        }

        let actionBtnHtml = '';
        if (!m.isSimulated && !m.isLive) {
          if (isMdUnlocked) {
            actionBtnHtml = `
              <button type="button" class="btn-sim-single btn-sim-league-match" data-md="${selectedMdIdx}" data-midx="${mIdx}">
                <i class="fa-solid fa-play"></i> SIMULATE (1 MIN)
              </button>
            `;
          } else {
            actionBtnHtml = `
              <button type="button" class="btn-sim-single btn-single-locked" disabled title="Complete Matchday ${firstPendingIdx + 1} first to unlock this fixture">
                <i class="fa-solid fa-lock"></i> LOCKED
              </button>
            `;
          }
        } else if (m.isLive) {
          actionBtnHtml = `<span class="live-pill">🔴 IN PLAY</span>`;
        } else if (m.isSimulated) {
          actionBtnHtml = `<span class="ft-pill"><i class="fa-solid fa-check"></i> FULL TIME</span>`;
        }

        return `
          <div class="laliga-fixture-card ${m.isLive ? 'live-now' : ''}" data-md="${selectedMdIdx}" data-midx="${mIdx}">
            <div class="fixture-top-meta">
              <span class="fixture-venue" title="${m.stadium}, ${m.city}">
                <i class="fa-solid fa-location-dot"></i> ${m.stadium}, ${m.city}
              </span>
              <span class="fixture-time-slot">${m.time}</span>
            </div>

            <div class="bracket-team-row ${isWinnerHome ? 'winner-row' : ''}">
              <span class="b-team-name">${getTeamLogoHtml(m.home)}${m.home}</span>
              <span class="b-team-score">${homeScore}</span>
            </div>
            <div class="bracket-team-row ${isWinnerAway ? 'winner-row' : ''}">
              <span class="b-team-name">${getTeamLogoHtml(m.away)}${m.away}</span>
              <span class="b-team-score">${awayScore}</span>
            </div>

            ${timerHtml}
            ${eventsHtml}

            <div class="match-card-actions">
              ${actionBtnHtml}
              <button type="button" class="sfc-action-btn btn-open-detailed-stats" data-md="${selectedMdIdx}" data-midx="${mIdx}" data-home="${m.home}" data-away="${m.away}">📊 Detailed Stats</button>
            </div>
          </div>

        `;
      }).join('');

      return `
        <div class="day-schedule-group">
          <div class="day-schedule-header">
            <i class="fa-solid fa-calendar-day day-icon"></i>
            <span>${dayName.toUpperCase()} FIXTURES (${dayMatches.length} MATCHES • OFFICIAL SCHEDULE)</span>
          </div>
          <div class="day-fixtures-grid">
            ${matchCardsHtml}
          </div>
        </div>
      `;
    }).join('');

    let lockBannerHtml = '';
    if (!isMdUnlocked) {
      lockBannerHtml = `
        <div class="matchday-lock-alert">
          <div class="lock-alert-icon"><i class="fa-solid fa-lock"></i></div>
          <div class="lock-alert-info">
            <div class="lock-alert-title">MATCHDAY ${selectedMdIdx + 1} IS LOCKED</div>
            <div class="lock-alert-desc">Matches must be played in sequence. Complete <strong>Matchday ${firstPendingIdx + 1}</strong> first to unlock this round.</div>
          </div>
          <button type="button" class="btn-jump-unlocked-md" data-jump="${firstPendingIdx}">
            <i class="fa-solid fa-arrow-right"></i> GO TO MATCHDAY ${firstPendingIdx + 1}
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <!-- Simulator Top Bar (LaLiga Sim View) -->
      ${isLaLiga ? `
        <div class="laliga-sim-topbar">
          <button type="button" class="laliga-back-btn" id="btn-back-laliga-home">
            <i class="fa-solid fa-arrow-left"></i>
            <span>BACK TO LALIGA HOME</span>
          </button>
          <div class="laliga-sim-topbar-title">
            <i class="fa-solid fa-futbol"></i>
            <span>LALIGA EA SPORTS — MATCHDAY SIMULATOR</span>
          </div>
          <div class="laliga-sim-topbar-actions">
            <span class="data-badge SIMULATION">MATCHDAY ${state.currentMatchday} / ${state.totalMatchdays} DONE</span>
          </div>
        </div>
      ` : ''}

      <!-- Matchday Hub Section -->
      <section class="matchday-hub-section" id="matchday-hub-section">
        <div class="matchday-header-row">
          <div class="matchday-title-group">
            <h2 class="matchday-main-title">
              <i class="fa-solid fa-futbol" style="color:#FF2B44;"></i>
              <span>MATCHDAY ${selectedMdIdx + 1} OF ${state.totalMatchdays}</span>
            </h2>
            <span class="matchday-badge ${isRoundDone ? 'completed' : (!isMdUnlocked ? 'locked' : '')}">
              ${isRoundDone ? 'COMPLETED' : (!isMdUnlocked ? '<i class="fa-solid fa-lock"></i> LOCKED' : 'OFFICIAL API SCHEDULE')}
            </span>
          </div>

          <div class="matchday-action-controls">
            <button type="button" class="btn-sim-matchday ${!isMdUnlocked ? 'btn-locked-state' : ''}" id="btn-sim-cur-matchday" ${isRoundDone || !isMdUnlocked ? 'disabled' : ''} title="${!isMdUnlocked ? `Complete Matchday ${firstPendingIdx + 1} first` : ''}">
              <i class="fa-solid ${!isMdUnlocked ? 'fa-lock' : 'fa-bolt'}"></i>
              <span>${!isMdUnlocked ? `LOCKED (MD ${firstPendingIdx + 1} REQ)` : `SIMULATE MATCHDAY ${selectedMdIdx + 1} (1 MIN)`}</span>
            </button>
            <button type="button" class="btn-instant-matchday ${!isMdUnlocked ? 'btn-locked-state' : ''}" id="btn-instant-cur-matchday" ${isRoundDone || !isMdUnlocked ? 'disabled' : ''} title="${!isMdUnlocked ? `Complete Matchday ${firstPendingIdx + 1} first` : ''}">
              <i class="fa-solid ${!isMdUnlocked ? 'fa-lock' : 'fa-forward'}"></i>
              <span>${!isMdUnlocked ? 'LOCKED' : 'INSTANT RESULT'}</span>
            </button>
          </div>
        </div>

        <!-- Matchday Selector Pills -->
        <div class="matchday-nav-pills">
          ${matchdayPillsHtml}
        </div>

        <!-- Lock Warning Banner (if locked) -->
        ${lockBannerHtml}

        <!-- Day-by-Day Schedule Groups -->
        <div class="matchdays-schedule-container">
          ${dayScheduleHtml}
        </div>
      </section>
    `;

    // Attach listeners for matchday pills
    container.querySelectorAll('.md-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const mdIdx = parseInt(pill.dataset.md, 10);
        state.selectedMatchday = mdIdx;
        renderLeagueSeasonTable(state, container);
      });
    });

    // Attach listener for Jump to Unlocked Matchday button
    const jumpBtn = container.querySelector('.btn-jump-unlocked-md');
    if (jumpBtn) {
      jumpBtn.addEventListener('click', () => {
        const jumpTarget = parseInt(jumpBtn.dataset.jump, 10);
        if (!isNaN(jumpTarget)) {
          state.selectedMatchday = jumpTarget;
          renderLeagueSeasonTable(state, container);
        }
      });
    }

    // Attach listener for single match simulate
    container.querySelectorAll('.btn-sim-league-match').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const md = parseInt(btn.dataset.md, 10);
        const midx = parseInt(btn.dataset.midx, 10);
        simulateSingleLeagueMatch(md, midx);
      });
    });

    // Attach listener for Simulate Matchday
    const simMdBtn = container.querySelector('#btn-sim-cur-matchday');
    if (simMdBtn) {
      simMdBtn.addEventListener('click', () => {
        simulateLeagueMatchdayWithClock(selectedMdIdx);
      });
    }

    // Attach listener for Instant Matchday
    const instantMdBtn = container.querySelector('#btn-instant-cur-matchday');
    if (instantMdBtn) {
      instantMdBtn.addEventListener('click', () => {
        simulateLeagueMatchdayInstant(selectedMdIdx);
      });
    }

    // Back to LaLiga Home button
    const backBtn = container.querySelector('#btn-back-laliga-home');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        state.subView = 'home';
        renderLeagueSeasonTable(state, container);
      });
    }
  }

  function renderGroupsGrid(state, container) {
    const config = TOURNAMENTS_CONFIG[activeTournKey] || {};

    // 1. Identify which 3rd-placed teams qualified
    const thirdBestNames = new Set();
    const qualifiedTeamsList = [];

    if (state.groupsPlayed && state.groups) {
      const thirdBest = [];
      Object.keys(state.groups).forEach(letter => {
        const teams = state.groups[letter];
        if (teams && teams[0]) qualifiedTeamsList.push({ name: teams[0].name, isBest3rd: false, group: letter, rank: '1st' });
        if (teams && teams[1]) qualifiedTeamsList.push({ name: teams[1].name, isBest3rd: false, group: letter, rank: '2nd' });
        if (teams && teams[2]) {
          thirdBest.push({ ...teams[2], group: letter });
        }
      });

      const numQual = config.format === 'worldcup48' ? 8 : (config.format === 'euro24' ? 4 : 0);
      thirdBest.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).slice(0, numQual).forEach(t => {
        thirdBestNames.add(t.name.toUpperCase());
        qualifiedTeamsList.push({ name: t.name, isBest3rd: true, group: t.group, rank: '3rd' });
      });
    }

    let summaryHubHtml = '';
    if (state.groupsPlayed && qualifiedTeamsList.length > 0) {
      const nextStageName = config.format === 'worldcup48' ? 'ROUND OF 32' : (config.format === 'euro24' ? 'ROUND OF 16' : 'QUARTERFINALS');
      summaryHubHtml = `
        <div class="groups-qualified-summary-card">
          <div class="gq-header">
            <div class="gq-title">
              <span class="gq-trophy">🏆</span>
              <div>
                <h4>${qualifiedTeamsList.length} CONTENDERS ADVANCED TO ${nextStageName}</h4>
                <span class="gq-subtitle">Group Stage Complete • Qualifiers Secured for Knockout Bracket</span>
              </div>
            </div>
            <div class="gq-actions-row">
              <button type="button" class="btn-gq-resim" id="btn-gq-resim"><i class="fa-solid fa-rotate"></i> Re-Simulate Groups</button>
              <button type="button" class="btn-gq-advance" id="btn-gq-goto-r32">⚡ VIEW ${nextStageName} BRACKET →</button>
            </div>
          </div>
          <div class="gq-teams-pills-wrap">
            ${qualifiedTeamsList.map(t => `
              <div class="gq-team-chip">
                ${getTeamLogoHtml(t.name)}
                <span>${t.name}</span>
                <span class="gq-tag ${t.isBest3rd ? 'tag-3rd' : 'tag-top2'}">${t.isBest3rd ? '3RD' : 'TOP 2'}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } else {
      summaryHubHtml = `
        <div class="groups-command-hub-banner">
          <div class="gch-info">
            <div class="gch-icon">⚡</div>
            <div>
              <h3 class="gch-heading">GROUP STAGE FIXTURES READY (12 GROUPS • 48 TEAMS)</h3>
              <p class="gch-desc">Simulate all 36 group matches to determine the top 2 from each group plus the 8 best 3rd-placed teams advancing to the Round of 32.</p>
            </div>
          </div>
          <button type="button" class="btn-sim-all-groups-hero" id="btn-sim-all-groups">
            <i class="fa-solid fa-play"></i> ⚡ SIMULATE ALL 12 GROUPS
          </button>
        </div>
      `;
    }

    const groupCardsHtml = Object.keys(state.groups).map(letter => {
      const teams = state.groups[letter];
      return `
        <div class="group-card">
          <div class="group-title">
            <span><i class="fa-solid fa-layer-group" style="color:var(--champions-gold);margin-right:6px;"></i> GROUP ${letter}</span>
            ${state.groupsPlayed ? '<span class="group-status-done"><i class="fa-solid fa-check"></i> PLAYED</span>' : `<button type="button" class="btn-quick-group-sim" data-group="${letter}"><i class="fa-solid fa-play"></i> Sim Group</button>`}
          </div>
          <table class="group-table">
            <thead>
              <tr>
                <th>#</th>
                <th>NATION / TEAM</th>
                <th>MP</th>
                <th>W</th>
                <th>D</th>
                <th>L</th>
                <th>GD</th>
                <th>PTS</th>
              </tr>
            </thead>
            <tbody>
              ${teams.map((t, idx) => {
                const isTop2 = state.groupsPlayed && (idx < 2);
                const isBest3rd = state.groupsPlayed && idx === 2 && thirdBestNames.has(t.name.toUpperCase());
                const isElim = state.groupsPlayed && (!isTop2 && !isBest3rd);

                let qualBadge = '';
                if (state.groupsPlayed) {
                  if (idx === 0) qualBadge = '<span class="qual-badge-pill rank-1">🏆 1ST • QUALIFIED</span>';
                  else if (idx === 1) qualBadge = '<span class="qual-badge-pill rank-2">✅ 2ND • QUALIFIED</span>';
                  else if (isBest3rd) qualBadge = '<span class="qual-badge-pill rank-3-qual">⚡ 3RD • QUALIFIED</span>';
                  else qualBadge = '<span class="elim-badge-pill">ELIMINATED</span>';
                }

                const rowClass = isTop2 ? 'qualified' : (isBest3rd ? 'qualified-3rd' : (isElim ? 'eliminated' : ''));

                return `
                  <tr class="${rowClass}">
                    <td>
                      <span class="pos-badge ${idx === 0 ? 'pos-champion' : (idx === 1 ? 'pos-ucl' : '')}">
                        ${idx + 1}
                      </span>
                    </td>
                    <td class="b-team-name-cell">
                      <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
                        ${getTeamLogoHtml(t.name)}
                        <strong>${t.name.toUpperCase()}</strong>
                        ${state.groupsPlayed && idx === 0 ? '<i class="fa-solid fa-crown widget-crown-icon"></i>' : ''}
                        ${qualBadge}
                      </div>
                    </td>
                    <td>${t.mp}</td>
                    <td>${t.w || 0}</td>
                    <td>${t.d || 0}</td>
                    <td>${t.l || 0}</td>
                    <td>${t.gd > 0 ? '+' + t.gd : (t.gd || 0)}</td>
                    <td><strong class="${idx < 2 || isBest3rd ? 'gold-text' : 'pts-val'}">${t.pts}</strong></td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }).join('');

    container.innerHTML = summaryHubHtml + groupCardsHtml;

    // Attach listeners
    const simAllBtn = container.querySelector('#btn-sim-all-groups');
    if (simAllBtn) {
      simAllBtn.addEventListener('click', () => {
        resolveGroupStage();
        renderActiveTournament();
      });
    }

    const resimBtn = container.querySelector('#btn-gq-resim');
    if (resimBtn) {
      resimBtn.addEventListener('click', () => {
        resolveGroupStage();
        renderActiveTournament();
      });
    }

    const gotoBtn = container.querySelector('#btn-gq-goto-r32');
    if (gotoBtn) {
      gotoBtn.addEventListener('click', () => {
        const nextStage = config.format === 'worldcup48' ? 'r32' : (config.format === 'euro24' ? 'r16' : 'qf');
        setStageTab(nextStage, true);
      });
    }

    container.querySelectorAll('.btn-quick-group-sim').forEach(btn => {
      btn.addEventListener('click', () => {
        const groupLetter = btn.dataset.group;
        if (!groupLetter || !state.groups || !state.groups[groupLetter]) return;
        const groups = state.groups;
        const teams = groups[groupLetter];
        // Reset team stats
        teams.forEach(t => { t.mp = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.pts = 0; });
        // Simulate round-robin fixtures for this group (6 matches for 4 teams)
        const fixtures = [
          [0, 1], [2, 3],
          [0, 2], [1, 3],
          [0, 3], [1, 2]
        ];
        fixtures.forEach(([hIdx, aIdx]) => {
          const res = precomputeMatchResult(teams[hIdx].name, teams[aIdx].name, false);
          res.isSimulated = true;
          teams[hIdx].mp++; teams[aIdx].mp++;
          teams[hIdx].gf += res.regHome; teams[hIdx].ga += res.regAway;
          teams[aIdx].gf += res.regAway; teams[aIdx].ga += res.regHome;
          if (res.regHome > res.regAway) {
            teams[hIdx].w++; teams[hIdx].pts += 3; teams[aIdx].l++;
          } else if (res.regAway > res.regHome) {
            teams[aIdx].w++; teams[aIdx].pts += 3; teams[hIdx].l++;
          } else {
            teams[hIdx].d++; teams[hIdx].pts += 1; teams[aIdx].d++; teams[aIdx].pts += 1;
          }
        });
        teams.forEach(t => { t.gd = t.gf - t.ga; });
        teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
        // Mark that this group has been played; if ALL groups are played, set global flag
        const allPlayed = Object.keys(groups).every(lg => groups[lg].every(t => t.mp > 0));
        if (allPlayed) state.groupsPlayed = true;
        renderActiveTournament();
      });
    });
  }

  function renderPlaceholderMatchCard(p, stage, idx, isFinal = false) {
    return `
      <div class="bracket-match-card placeholder-card ${isFinal ? 'final-match' : ''}" data-match-id="${stage}_placeholder_${idx}">
        ${isFinal ? '<div class="live-now-badge">🏆 GRAND FINAL FIXTURE</div>' : ''}
        <div class="match-meta-tag">FIXTURE #${idx + 1} • ${p.fixture || 'KNOCKOUT FIXTURE'}</div>
        <div class="bracket-team-row">
          <span class="b-team-name"><span class="team-logo-emoji">⏳</span> ${p.home}</span>
          <span class="b-team-score">–</span>
        </div>
        <div class="bracket-team-row">
          <span class="b-team-name"><span class="team-logo-emoji">⏳</span> ${p.away}</span>
          <span class="b-team-score">–</span>
        </div>
        <div class="match-card-actions">
          <span class="empty-stage-hint-tag">⏳ QUALIFICATION PENDING</span>
          <button type="button" class="sfc-action-btn btn-open-detailed-stats" data-stage="${stage}" data-idx="${idx}" data-home="${p.home}" data-away="${p.away}" style="font-size:0.65rem;padding:3px 8px;">📊 Detailed Stats</button>
        </div>
      </div>

    `;
  }

  function renderMatchCard(m, stage, idx, isFinal = false) {
    const config = TOURNAMENTS_CONFIG[activeTournKey] || {};
    const homeScore = m.isSimulated ? m.scoreHome : (m.isLive ? m.currentDisplayScoreHome : '–');
    const awayScore = m.isSimulated ? m.scoreAway : (m.isLive ? m.currentDisplayScoreAway : '–');
    const isWinnerHome = m.isSimulated && m.winner === m.home;
    const isWinnerAway = m.isSimulated && m.winner === m.away;

    // Filter events to show based on simulation progress
    const curMin = m.isLive ? (m.currentSimMinute || 0) : 120;
    const activeEvents = (m.events || []).filter(e => m.isSimulated || (m.isLive && e.minute <= curMin));
    const homeEvents = activeEvents.filter(e => e.team === 'home');
    const awayEvents = activeEvents.filter(e => e.team === 'away');

    const hasEventsToShow = (m.isSimulated || m.isLive) && activeEvents.length > 0;

    let stageClass = '';
    let stageHeaderBadge = '';
    if (stage === 'qf') {
      stageClass = 'stage-qf';
      stageHeaderBadge = `<div class="stage-badge-qf">⚡ QUARTERFINAL #${idx + 1}</div>`;
    } else if (stage === 'sf') {
      stageClass = 'stage-sf';
      stageHeaderBadge = `<div class="stage-badge-sf">🔥 SEMIFINAL CLASH • ROAD TO GLORY</div>`;
    } else if (stage === 'gf' || isFinal) {
      stageClass = 'stage-gf final-match';
      stageHeaderBadge = `<div class="stage-badge-gf">🏆 THE WORLD CHAMPIONSHIP FINAL</div>`;
    }

    let liveTimerHtml = '';
    let pitch3dRadarHtml = '';
    if (m.isLive) {
      const maxMin = m.hadExtraTime ? 120 : 90;
      const simMin = Math.min(maxMin, m.currentSimMinute || 0);
      const pct = Math.min(100, Math.round((simMin / maxMin) * 100));
      let phaseLabel = 'FIRST HALF';
      if (simMin > 45 && simMin <= 90) phaseLabel = 'SECOND HALF';
      else if (simMin > 90) phaseLabel = 'EXTRA TIME';

      liveTimerHtml = `
        <div class="card-live-timer">
          <div class="card-live-header">
            <span>🔴 SIMULATING • ${phaseLabel}</span>
            <span>⏱ ${simMin}'</span>
          </div>
          <div class="card-live-progress">
            <div class="card-live-progress-fill" style="width: ${pct}%"></div>
          </div>
        </div>
      `;

      // Calculate 3D Ball Coordinates (X, Y, Z) and Tactical Radar Action
      const goalEvent = (m.events || []).find(e => Math.abs(e.minute - simMin) <= 6);
      const isGoalNow = !!goalEvent;

      let ballX = 50;
      let ballY = 50;
      let ballZ = 4;
      let actionLabel = '📍 Midfield Possession Battle';

      if (goalEvent) {
        if (goalEvent.team === 'home') {
          // Home goal: ball curves into away net on right
          ballX = 93;
          ballY = 46;
          ballZ = 22;
          actionLabel = `⚽ GOAL! ${goalEvent.player} (${goalEvent.minute}') — ${m.home}`;
        } else {
          // Away goal: ball curves into home net on left
          ballX = 7;
          ballY = 46;
          ballZ = 22;
          actionLabel = `⚽ GOAL! ${goalEvent.player} (${goalEvent.minute}') — ${m.away}`;
        }
      } else if (simMin < 10) {
        ballX = 50 + Math.sin(simMin * 0.8) * 8;
        ballY = 50 + Math.cos(simMin * 0.8) * 12;
        ballZ = 3;
        actionLabel = '📍 Kickoff & Midfield Opening Exchanges';
      } else if (simMin % 24 < 12) {
        // Home attacking towards right
        const prog = (simMin % 12) / 12;
        ballX = 55 + prog * 30 + Math.sin(simMin * 1.2) * 5;
        ballY = 32 + Math.cos(simMin * 0.9) * 36;
        ballZ = 8 + Math.sin(simMin * 1.5) * 6;
        actionLabel = `⚡ Attacking Build-up into Final Third · ${m.home}`;
      } else {
        // Away attacking towards left
        const prog = ((simMin - 12) % 12) / 12;
        ballX = 45 - prog * 30 - Math.sin(simMin * 1.2) * 5;
        ballY = 32 + Math.sin(simMin * 0.9) * 36;
        ballZ = 8 + Math.cos(simMin * 1.5) * 6;
        actionLabel = `⚡ Counter Attack & Wing Penetration · ${m.away}`;
      }

      pitch3dRadarHtml = `
        <div class="card-3d-pitch-radar" aria-label="3D Match Ball Radar">
          <div class="pitch-3d-turf">
            <div class="pitch-3d-lines">
              <div class="pitch-3d-center-circle"></div>
              <div class="pitch-3d-center-spot"></div>
              <div class="pitch-3d-halfway"></div>
              <div class="pitch-3d-box-left"></div>
              <div class="pitch-3d-box-right"></div>
              <div class="pitch-3d-goal-left"></div>
              <div class="pitch-3d-goal-right"></div>
            </div>
            <div class="pitch-3d-ball-wrapper" style="left: ${ballX.toFixed(1)}%; top: ${ballY.toFixed(1)}%; transform: translate3d(0, 0, ${ballZ.toFixed(1)}px);">
              <div class="pitch-3d-ball-element ${isGoalNow ? 'goal-strike' : ''}">
                <div class="ball-pentagons"></div>
              </div>
              <div class="pitch-3d-ball-shadow"></div>
              ${isGoalNow ? `<div class="pitch-3d-goal-flash">⚽ GOLAZO!</div>` : ''}
            </div>
          </div>
          <div class="pitch-3d-tactical-banner">
            <span class="pitch-3d-live-dot"></span>
            <span class="pitch-3d-tactical-text">${actionLabel}</span>
          </div>
        </div>
      `;
    }

    let eventsHtml = '';
    if (hasEventsToShow || (m.hadPenalties && m.isSimulated)) {
      const homeEventsText = homeEvents.map(e => `${e.player || 'Goal'} ${e.minute}'${(e.type && e.type.includes('ET')) || e.minute > 90 ? ' (ET)' : ''}`).join(', ');
      const awayEventsText = awayEvents.map(e => `${e.player || 'Goal'} ${e.minute}'${(e.type && e.type.includes('ET')) || e.minute > 90 ? ' (ET)' : ''}`).join(', ');

      eventsHtml = `
        <div class="match-events-list">
          ${homeEventsText ? `<div class="match-event-row"><span class="event-team">${m.home}:</span> <span class="event-player">${homeEventsText}</span></div>` : ''}
          ${awayEventsText ? `<div class="match-event-row"><span class="event-team">${m.away}:</span> <span class="event-player">${awayEventsText}</span></div>` : ''}
          ${m.hadPenalties && m.isSimulated ? `
            <div class="match-pens-summary">
              <span>🧤 PENS (${m.penHome} - ${m.penAway}): ${m.winner} won shootout</span>
            </div>
          ` : ''}
        </div>
      `;
    }

    let ftBadgeText = 'FT';
    if (m.hadPenalties) ftBadgeText = `FT (PENS ${m.penHome}-${m.penAway})`;
    else if (m.hadExtraTime) ftBadgeText = 'AET';

    const compTitle = config.name || 'FIFA WORLD CUP 2026';
    const stageTitle = STAGE_META[stage]?.title || stage.toUpperCase();

    const statusBadge = m.isLive
      ? `<span class="sfc-status-badge live">🔴 LIVE ${m.currentSimMinute || 0}'</span>`
      : m.isSimulated
        ? `<span class="sfc-status-badge ft">${ftBadgeText}</span>`
        : `<span class="sfc-status-badge upcoming">UPCOMING</span>`;

    // Build chronological match events timeline
    const allEvents = (m.events || [])
      .filter(e => m.isLive ? e.minute <= (m.currentSimMinute || 0) : m.isSimulated)
      .sort((a, b) => b.minute - a.minute);

    const timelineHtml = allEvents.length > 0 ? allEvents.map(e => {
      const isHome = e.team === 'home';
      const eventIcon = '⚽';
      return `
        <div class="sfc-event-row ${isHome ? 'ev-home' : 'ev-away'}">
          ${isHome ? `
            <div class="sfc-ev-content home-ev">
              <span class="sfc-ev-player">${e.player}</span>
              <span class="sfc-ev-icon">${eventIcon}</span>
            </div>
            <span class="sfc-ev-minute">${e.minute}'</span>
            <div class="sfc-ev-spacer"></div>
          ` : `
            <div class="sfc-ev-spacer"></div>
            <span class="sfc-ev-minute">${e.minute}'</span>
            <div class="sfc-ev-content away-ev">
              <span class="sfc-ev-icon">${eventIcon}</span>
              <span class="sfc-ev-player">${e.player}</span>
            </div>
          `}
        </div>
      `;
    }).join('') : `<div class="sfc-no-events">${m.isSimulated ? 'No goals scored' : 'Match not yet played'}</div>`;

    if (m.hadPenalties && m.isSimulated) {
      // Append penalty result
    }

    // Top performers — pick top scorers per team
    const homeTopScorer = (m.events || []).filter(e => e.team === 'home')[0];
    const awayTopScorer = (m.events || []).filter(e => e.team === 'away')[0];
    const motm = homeTopScorer || awayTopScorer;

    // Chance distribution
    const homeStr = (window.NATIONS_DATA || []).find(n => n.name === m.home)?.str || 75;
    const awayStr = (window.NATIONS_DATA || []).find(n => n.name === m.away)?.str || 75;
    const total = homeStr + awayStr + 30;
    const homePct = Math.round((homeStr / total) * 100);
    const drawPct = Math.round(30 / total * 100);
    const awayPct = 100 - homePct - drawPct;

    // Tactical patterns
    const tacticalPatterns = [
      { f: '4-3-3', s: 'Gegenpress' },
      { f: '4-2-3-1', s: 'Wing Overloads' },
      { f: '3-5-2', s: 'Central Overload' },
      { f: '4-4-2', s: 'Direct Attack' },
      { f: '4-1-4-1', s: 'Deep Possession' }
    ];
    const hPat = tacticalPatterns[(m.home.charCodeAt(0) + stage.charCodeAt(0)) % 5];
    const aPat = tacticalPatterns[(m.away.charCodeAt(0) + (idx || 0) + 2) % 5];

    return `
      <div class="sfc-match-wrapper ${m.isLive ? 'sfc-live' : ''}" data-stage="${stage}" data-idx="${idx}" data-match-id="${stage}_${idx}">
        <div class="sfc-card unified-match-card">

          <!-- TOP META BAR -->
          <div class="sfc-card-header">
            <div class="sfc-comp-label">🏆 ${compTitle} · ${stageTitle} · FIXTURE #${idx + 1}</div>
            <div class="sfc-status-badge-wrap">${statusBadge}</div>
          </div>

          <!-- UNIFIED 3-COLUMN HERO: TEAM 1 — BROADCAST PITCH RADAR — TEAM 2 -->
          <div class="sfc-hero-matchup">

            <!-- TEAM 1 (HOME) -->
            <div class="sfc-hero-team home-side ${isWinnerHome ? 'winner-side' : ''}">
              <div class="sfc-team-crest ${isWinnerHome ? 'winner-crest' : ''}">
                ${getTeamLogoHtml(m.home)}
                ${isWinnerHome ? '<span class="sfc-winner-badge">👑</span>' : ''}
              </div>
              <div class="sfc-team-info">
                <div class="sfc-team-name">${m.home.toUpperCase()}</div>
                <div class="sfc-tactic-tag"><span class="tac-form">${hPat.f}</span> <span class="tac-style">${hPat.s}</span></div>
              </div>
              <div class="sfc-score-box ${isWinnerHome ? 'winner-score' : ''}">${homeScore}</div>
            </div>

            <!-- CENTER: LIVE BROADCAST RADAR & STADIUM PITCH -->
            <div class="sfc-hero-center-broadcast">
              ${pitch3dRadarHtml || `
                <div class="sfc-mini-pitch-broadcast">
                  <div class="sfc-pitch-turf">
                    <div class="sfc-pitch-center-circle"></div>
                    <div class="sfc-pitch-halfway"></div>
                    <span class="sfc-pitch-vs-pill">VS</span>
                  </div>
                </div>
              `}
              ${m.isLive ? `
                <div class="sfc-live-progress-box">
                  <div class="sfc-live-text">⏱ ${m.currentSimMinute || 0}' IN PLAY</div>
                  <div class="sfc-live-bar-track">
                    <div class="sfc-live-bar-fill" style="width:${Math.min(100, Math.round(((m.currentSimMinute || 0) / 90) * 100))}%"></div>
                  </div>
                </div>
              ` : ''}
              ${m.hadPenalties && m.isSimulated ? `<div class="sfc-pens-tag">🧤 PENS: ${m.penHome} - ${m.penAway} (${m.winner} WON)</div>` : (m.hadExtraTime ? `<div class="sfc-aet-tag">AFTER EXTRA TIME</div>` : '')}
            </div>

            <!-- TEAM 2 (AWAY) -->
            <div class="sfc-hero-team away-side ${isWinnerAway ? 'winner-side' : ''}">
              <div class="sfc-score-box ${isWinnerAway ? 'winner-score' : ''}">${awayScore}</div>
              <div class="sfc-team-info">
                <div class="sfc-team-name">${m.away.toUpperCase()}</div>
                <div class="sfc-tactic-tag"><span class="tac-form">${aPat.f}</span> <span class="tac-style">${aPat.s}</span></div>
              </div>
              <div class="sfc-team-crest ${isWinnerAway ? 'winner-crest' : ''}">
                ${getTeamLogoHtml(m.away)}
                ${isWinnerAway ? '<span class="sfc-winner-badge">👑</span>' : ''}
              </div>
            </div>

          </div>

          <!-- ACTION BUTTONS TOOLBAR -->
          <div class="sfc-header-actions">
            ${!m.isSimulated && !m.isLive ? `
              <button type="button" class="sfc-action-btn btn-card-fast-sim" data-stage="${stage}" data-idx="${idx}"><i class="fa-solid fa-play"></i> Simulate</button>
              <button type="button" class="sfc-action-btn btn-sim-single" data-stage="${stage}" data-idx="${idx}"><i class="fa-solid fa-crosshairs"></i> Track Live</button>
              <button type="button" class="sfc-action-btn btn-open-holo-broadcast" data-stage="${stage}" data-idx="${idx}"><i class="fa-solid fa-tv"></i> Broadcast</button>
              <button type="button" class="sfc-action-btn btn-open-detailed-stats" data-stage="${stage}" data-idx="${idx}" data-home="${m.home}" data-away="${m.away}"><i class="fa-solid fa-chart-column"></i> Detailed Stats</button>
            ` : m.isSimulated ? `
              <button type="button" class="sfc-action-btn btn-open-holo-broadcast" data-stage="${stage}" data-idx="${idx}"><i class="fa-solid fa-vr-cardboard"></i> Holo Replay</button>
              <button type="button" class="sfc-action-btn btn-open-detailed-stats btn-match-report" data-stage="${stage}" data-idx="${idx}" data-home="${m.home}" data-away="${m.away}" data-rewatch="true"><i class="fa-solid fa-film"></i> Match Report &amp; Replay</button>
            ` : `
              <button type="button" class="sfc-action-btn btn-open-detailed-stats" data-stage="${stage}" data-idx="${idx}" data-home="${m.home}" data-away="${m.away}"><i class="fa-solid fa-chart-column"></i> Detailed Stats</button>
            `}
          </div>

          <!-- TABS -->
          <div class="sfc-tabs">
            <button type="button" class="sfc-tab active" data-card="${stage}_${idx}" data-tab="summary">Summary & Events</button>
            <button type="button" class="sfc-tab" data-card="${stage}_${idx}" data-tab="stats">Match Stats</button>
            <button type="button" class="sfc-tab" data-card="${stage}_${idx}" data-tab="lineups">Lineups & Tactics</button>
          </div>

          <!-- TAB BODY -->
          <div class="sfc-tab-body">

            <!-- SUMMARY PANEL -->
            <div class="sfc-panel panel-summary" data-card="${stage}_${idx}" data-panel="summary">
              <div class="sfc-panel-columns">

                <!-- Left: Timeline -->
                <div class="sfc-timeline-col">
                  <div class="sfc-section-title">⚽ Match Timeline & Goals</div>
                  <div class="sfc-timeline">
                    ${timelineHtml}
                  </div>
                </div>

                <!-- Right: Top Performers + Chance Dist -->
                <div class="sfc-performers-col">
                  ${motm ? `
                    <div class="sfc-section-title">⭐ Top Performers</div>
                    <div class="sfc-performers-bar">
                      ${homeTopScorer ? `
                        <div class="sfc-performer home-performer">
                          <div class="sfc-perf-jersey">⚽</div>
                          <div class="sfc-perf-info">
                            <div class="sfc-perf-name">${homeTopScorer.player}</div>
                            <div class="sfc-perf-team">${m.home}</div>
                          </div>
                        </div>
                      ` : ''}
                      ${awayTopScorer ? `
                        <div class="sfc-performer away-performer">
                          <div class="sfc-perf-jersey">⚽</div>
                          <div class="sfc-perf-info">
                            <div class="sfc-perf-name">${awayTopScorer.player}</div>
                            <div class="sfc-perf-team">${m.away}</div>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  ` : ''}

                  <div class="sfc-section-title" style="margin-top:10px;">📊 Win Probability & Chance Distribution</div>
                  <div class="sfc-chance-row">
                    <span class="sfc-chance-label home-label">${m.home.substring(0, 3)} (${homePct}%)</span>
                    <span class="sfc-chance-draw">Draw (${drawPct}%)</span>
                    <span class="sfc-chance-label away-label">${m.away.substring(0, 3)} (${awayPct}%)</span>
                  </div>
                  <div class="sfc-chance-bar">
                    <div class="sfc-chance-home-fill" style="width:${homePct}%"></div>
                    <div class="sfc-chance-draw-fill" style="width:${drawPct}%"></div>
                    <div class="sfc-chance-away-fill" style="width:${awayPct}%"></div>
                  </div>
                </div>

              </div>
            </div>

            <!-- STATS PANEL -->
            <div class="sfc-panel panel-stats hidden" data-card="${stage}_${idx}" data-panel="stats">
              <div class="sfc-stat-row"><span>${m.home}</span><span>Possession</span><span>${homePct}%</span></div>
              <div class="sfc-stat-row"><span>${homeScore}</span><span>Goals</span><span>${awayScore}</span></div>
              <div class="sfc-stat-row"><span>${hPat.f}</span><span>Formation</span><span>${aPat.f}</span></div>
              <div class="sfc-stat-row"><span>${hPat.s}</span><span>Style</span><span>${aPat.s}</span></div>
              ${m.hadExtraTime ? `<div class="sfc-stat-row"><span>✓</span><span>Extra Time</span><span>✓</span></div>` : ''}
              ${m.hadPenalties ? `<div class="sfc-stat-row"><span>${m.penHome}</span><span>Penalty Score</span><span>${m.penAway}</span></div>` : ''}
            </div>

            <!-- LINEUPS PANEL -->
            <div class="sfc-panel panel-lineups hidden" data-card="${stage}_${idx}" data-panel="lineups">
              <div class="sfc-lineup-row">
                <div class="sfc-lineup-team">
                  <div class="sfc-lineup-head home-lh">${m.home} · ${hPat.f}</div>
                  <div class="sfc-lineup-grid">${(window.TEAM_STAR_PLAYERS?.[m.home] || []).slice(0, 6).map(p => `<span class="sfc-player-chip">${p}</span>`).join('') || '<span class="sfc-player-chip">Formation TBC</span>'}</div>
                </div>
                <div class="sfc-lineup-team">
                  <div class="sfc-lineup-head away-lh">${m.away} · ${aPat.f}</div>
                  <div class="sfc-lineup-grid">${(window.TEAM_STAR_PLAYERS?.[m.away] || []).slice(0, 6).map(p => `<span class="sfc-player-chip">${p}</span>`).join('') || '<span class="sfc-player-chip">Formation TBC</span>'}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    `;
  }

  // ---------------------------------------------------------------------------
  // 8. 60-SECOND MATCHDAY & LEAGUE SIMULATION ENGINE
  // ---------------------------------------------------------------------------

  function simulateLeagueMatchdayWithClock(mdIdx, onComplete) {
    cancelAllActiveSimulationTimers();
    const state = tournamentState[activeTournKey];
    if (!state.matchdays || !state.matchdays[mdIdx]) return;
    if (!isMatchdayUnlocked(state, mdIdx)) {
      const firstPending = getFirstPendingMatchdayIdx(state);
      state.selectedMatchday = firstPending;
      renderActiveTournament();
      return;
    }
    const matches = state.matchdays[mdIdx];

    matches.forEach(m => {
      if (!m.isSimulated) {
        const outcome = precomputeMatchResult(m.home, m.away, false);
        m.scoreHome = outcome.regHome;
        m.scoreAway = outcome.regAway;
        m.events = outcome.events;
        m.isLive = true;
        m.isSimulated = false;
        m.currentSimMinute = 0;
        m.currentDisplayScoreHome = 0;
        m.currentDisplayScoreAway = 0;
      }
    });

    const roundTitle = `MATCHDAY ${mdIdx + 1}`;

    activeSimulationClock.isRunning = true;
    activeSimulationClock.isPaused = false;
    activeSimulationClock.stageKey = `md_${mdIdx}`;
    activeSimulationClock.currentSimMinute = 0;
    activeSimulationClock.activeMatches = matches;
    activeSimulationClock.totalSimMinutes = 90;
    activeSimulationClock.realDurationMs = 60000; // 1 minute per game
    activeSimulationClock.startTime = Date.now();
    activeSimulationClock.elapsedBeforePause = 0;

    const clockHud = document.getElementById('sim-clock-hud');
    const liveControlBar = document.getElementById('live-control-bar');
    const stageLabel = document.getElementById('clock-stage-label');
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resumeBtn = document.getElementById('sim-resume-btn');

    if (clockHud) clockHud.hidden = false;
    if (liveControlBar) liveControlBar.hidden = false;
    if (stageLabel) {
      stageLabel.textContent = `${TOURNAMENTS_CONFIG[activeTournKey].name} • ${roundTitle}`;
      stageLabel.dataset.stageKey = `md_${mdIdx}`;
    }
    if (pauseBtn) pauseBtn.hidden = false;
    if (resumeBtn) resumeBtn.hidden = true;

    const stageActionBtn = document.getElementById('sim-stage-action-btn');
    if (stageActionBtn) {
      stageActionBtn.textContent = `🔴 SIMULATING ${roundTitle}...`;
      stageActionBtn.disabled = true;
    }

    renderStageViewport();

    // Add matchday progress bar after the clock hud
    const matchdayProgressHTML = `
      <div class="matchday-progress" id="matchday-progress-bar">
        <div class="matchday-progress-fill" id="matchday-progress-fill"></div>
      </div>
    `;
    const existingProgress = document.getElementById('matchday-progress-bar');
    if (existingProgress) {
      existingProgress.style.width = '0%';
    } else {
      // Insert after the clock hud
      const hudInsert = document.getElementById('sim-clock-hud');
      if (hudInsert) {
        const progressContainer = document.createElement('div');
        progressContainer.innerHTML = matchdayProgressHTML;
        hudInsert.insertAdjacentElement('afterend', progressContainer.firstElementChild);
      }
    }

    // 1-second interval increments simulated minute by 1.5 (reaches 90' in exactly 60 seconds)
    activeSimulationInterval = setInterval(() => {
      if (activeSimulationClock.isPaused) return;

      activeSimulationClock.currentSimMinute += 1.5;
      const curMin = Math.floor(activeSimulationClock.currentSimMinute);

      const minText = document.getElementById('clock-minute-text');
      const progressFill = document.getElementById('clock-progress-fill');
      const mdProgressFill = document.getElementById('matchday-progress-fill');
      if (minText) {
        let halfText = 'FIRST HALF';
        if (curMin >= 45 && curMin < 90) halfText = 'SECOND HALF';
        else if (curMin >= 90) halfText = 'FULL TIME';
        minText.textContent = `${Math.min(90, curMin)}' (${halfText})`;
      }
      if (progressFill) progressFill.style.width = `${Math.min(100, (curMin / 90) * 100)}%`;
      if (mdProgressFill) mdProgressFill.style.width = `${Math.min(100, (curMin / 90) * 100)}%`;

      matches.forEach(m => {
        if (m.isLive) {
          m.currentSimMinute = curMin;
          m.currentDisplayScoreHome = m.events.filter(e => e.team === 'home' && e.minute <= curMin).length;
          m.currentDisplayScoreAway = m.events.filter(e => e.team === 'away' && e.minute <= curMin).length;
        }
      });

      renderStageViewport();

      if (curMin >= 90) {
        cancelAllActiveSimulationTimers();
        matches.forEach(m => {
          m.isLive = false;
          m.isSimulated = true;
          m.currentDisplayScoreHome = m.scoreHome;
          m.currentDisplayScoreAway = m.scoreAway;
        });

        recalculateLeagueStandings(state);
        state.currentMatchday = Math.max(state.currentMatchday, mdIdx + 1);
        if (state.selectedMatchday < state.totalMatchdays - 1) {
          state.selectedMatchday = mdIdx + 1;
        }

        // Animate completed matchday pill
        const completedPill = document.querySelector(`.md-pill[data-md="${mdIdx}"]`);
        if (completedPill) {
          completedPill.classList.add('pill-completed-animate');
          setTimeout(() => {
            completedPill.classList.remove('pill-completed-animate');
          }, 400);
        }

        // Remove progress bar
        const progressBar = document.getElementById('matchday-progress-bar');
        if (progressBar) progressBar.remove();

        renderActiveTournament();
        if (onComplete) onComplete();
        if (state.champion) {
          triggerChampionCelebration(state.champion);
        }
      }
    }, 1000);
  }

  function simulateAllLeagueMatchdaysWithClock(startMdIdx) {
    const state = tournamentState[activeTournKey];
    if (!state || !state.matchdays) return;
    leagueAutoSimActive = true;

    // Update FULL SIM button to show running state
    const instantBtn = document.getElementById('sim-instant-btn');
    if (instantBtn) {
      instantBtn.textContent = '⏹ STOP FULL SIM';
      instantBtn.classList.add('active-full-sim');
    }

    // Collect all pending matchday indices
    const pendingMdIndices = [];
    for (let i = Math.max(0, startMdIdx); i < state.matchdays.length; i++) {
      if (state.matchdays[i].some(m => !m.isSimulated)) pendingMdIndices.push(i);
    }

    if (pendingMdIndices.length === 0) {
      leagueAutoSimActive = false;
      if (instantBtn) { instantBtn.textContent = '🏆 FULL SIM'; instantBtn.classList.remove('active-full-sim'); }
      return;
    }

    const totalMd = pendingMdIndices.length;
    let currentMdPos = 0; // position within pendingMdIndices

    // Show HUD / live control bar
    const clockHud = document.getElementById('sim-clock-hud');
    const liveControlBar = document.getElementById('live-control-bar');
    const stageLabel = document.getElementById('clock-stage-label');
    const minText = document.getElementById('clock-minute-text');
    const progressFill = document.getElementById('clock-progress-fill');
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resumeBtn = document.getElementById('sim-resume-btn');
    const stageActionBtn = document.getElementById('sim-stage-action-btn');

    if (clockHud) clockHud.hidden = false;
    if (liveControlBar) liveControlBar.hidden = false;
    if (pauseBtn) pauseBtn.hidden = false;
    if (resumeBtn) resumeBtn.hidden = true;
    if (stageActionBtn) { stageActionBtn.textContent = '🔴 FULL SIM RUNNING…'; stageActionBtn.disabled = true; }

    // activeSimulationClock flags for pause/skip support
    activeSimulationClock.isRunning = true;
    activeSimulationClock.isPaused = false;

    function finishFullSim() {
      leagueAutoSimActive = false;
      cancelAllActiveSimulationTimers();
      if (instantBtn) { instantBtn.textContent = '🏆 FULL SIM'; instantBtn.classList.remove('active-full-sim'); }
      renderActiveTournament();
      if (state.champion) triggerChampionCelebration(state.champion);
    }

    function runMatchday(mdIdx) {
      if (!leagueAutoSimActive) return;

      const matches = state.matchdays[mdIdx];

      // Pre-compute outcomes for any unresolved matches
      matches.forEach(m => {
        if (!m.isSimulated) {
          const outcome = precomputeMatchResult(m.home, m.away, false);
          m.scoreHome = outcome.regHome;
          m.scoreAway = outcome.regAway;
          m.events = outcome.events || [];
          m.isLive = true;
          m.isSimulated = false;
          m.currentSimMinute = 0;
          m.currentDisplayScoreHome = 0;
          m.currentDisplayScoreAway = 0;
        }
      });

      // Update HUD label
      activeSimulationClock.stageKey = `md_${mdIdx}`;
      activeSimulationClock.currentSimMinute = 0;
      const roundLabel = `${TOURNAMENTS_CONFIG[activeTournKey].name} • MATCHDAY ${mdIdx + 1} / ${state.totalMatchdays}`;
      if (stageLabel) { stageLabel.textContent = roundLabel; stageLabel.dataset.stageKey = `md_${mdIdx}`; }
      if (minText) minText.textContent = "0' (KICKOFF)";
      if (progressFill) progressFill.style.width = '0%';

      state.selectedMatchday = mdIdx;
      renderStageViewport();

      // Fast clock: 100ms interval, 8 sim-minutes per tick → 90' in 12 ticks ≈ 1.2 seconds per matchday
      const TICK_MS = 100;
      const SIM_STEP = 8;
      let curMin = 0;

      const iv = setInterval(() => {
        if (!leagueAutoSimActive) { clearInterval(iv); return; }
        if (activeSimulationClock.isPaused) return;

        curMin = Math.min(curMin + SIM_STEP, 90);
        activeSimulationClock.currentSimMinute = curMin;

        // Update live display scores & fire goals minute by minute
        matches.forEach(m => {
          if (m.isLive) {
            m.currentSimMinute = curMin;
            m.currentDisplayScoreHome = (m.events || []).filter(e => e.team === 'home' && e.minute <= curMin).length;
            m.currentDisplayScoreAway = (m.events || []).filter(e => e.team === 'away' && e.minute <= curMin).length;

            // Finalize individual match when it hits 90'
            if (curMin >= 90 && !m.isSimulated) {
              m.isLive = false;
              m.isSimulated = true;
              m.currentDisplayScoreHome = m.scoreHome;
              m.currentDisplayScoreAway = m.scoreAway;

              // Update standings immediately as each match finalizes
              recalculateLeagueStandings(state);
            }
          }
        });

        // HUD clock update
        let halfLabel = curMin < 45 ? 'FIRST HALF' : curMin < 90 ? 'SECOND HALF' : 'FULL TIME';
        if (minText) minText.textContent = `${curMin}' (${halfLabel})`;
        if (progressFill) progressFill.style.width = `${Math.round((curMin / 90) * 100)}%`;

        // Update ticker with most recent goal
        const allGoals = [];
        matches.forEach(m => {
          const ev = (m.events || []).find(e => e.minute >= curMin - SIM_STEP && e.minute <= curMin);
          if (ev) allGoals.push(`⚽ ${ev.teamName}: ${ev.player} (${ev.minute}')`);
        });
        if (allGoals.length > 0) {
          const tickerEl = document.getElementById('bracket-ticker-text');
          if (tickerEl) tickerEl.textContent = `MD${mdIdx + 1}: ${allGoals.join(' | ')} // `;
        }

        // Render live table on every tick so standings update in real time
        renderStageViewport();

        if (curMin >= 90) {
          clearInterval(iv);
          activeSimulationInterval = null;

          // Ensure all matches in matchday are finalized
          matches.forEach(m => {
            if (!m.isSimulated) {
              m.isLive = false;
              m.isSimulated = true;
              m.currentDisplayScoreHome = m.scoreHome;
              m.currentDisplayScoreAway = m.scoreAway;
            }
          });
          recalculateLeagueStandings(state);
          state.currentMatchday = Math.max(state.currentMatchday, mdIdx + 1);
          if (state.selectedMatchday < state.totalMatchdays - 1) state.selectedMatchday = mdIdx + 1;

          const progressBar = document.getElementById('matchday-progress-bar');
          if (progressBar) progressBar.remove();

          renderStageViewport();

          // Check if season is done or move to next matchday
          currentMdPos++;
          if (!leagueAutoSimActive) { finishFullSim(); return; }

          if (currentMdPos >= totalMd || state.champion) {
            finishFullSim();
          } else {
            // Short pause between matchdays so user can visually register the table shift
            setTimeout(() => {
              if (leagueAutoSimActive) runMatchday(pendingMdIndices[currentMdPos]);
            }, 400);
          }
        }
      }, TICK_MS);

      activeSimulationInterval = iv;
    }

    runMatchday(pendingMdIndices[currentMdPos]);
  }

  function simulateSingleLeagueMatch(mdIdx, matchIdx) {
    const state = tournamentState[activeTournKey];
    if (!state.matchdays || !state.matchdays[mdIdx]) return;
    if (!isMatchdayUnlocked(state, mdIdx)) return;
    const match = state.matchdays[mdIdx][matchIdx];
    if (!match || match.isSimulated || match.isLive) return;

    if (match.scoreHome === null) {
      const outcome = precomputeMatchResult(match.home, match.away, false);
      match.scoreHome = outcome.regHome;
      match.scoreAway = outcome.regAway;
      match.events = outcome.events;
    }

    match.isLive = true;
    match.isSimulated = false;
    match.currentSimMinute = 0;
    match.currentDisplayScoreHome = 0;
    match.currentDisplayScoreAway = 0;
    renderStageViewport();

    const simKey = `league_${mdIdx}_${matchIdx}`;
    if (activeSingleMatchIntervals[simKey]) {
      clearInterval(activeSingleMatchIntervals[simKey]);
    }

    // Step by 6 simulated minutes every 300ms (~4.5s animated broadcast per match)
    activeSingleMatchIntervals[simKey] = setInterval(() => {
      match.currentSimMinute = (match.currentSimMinute || 0) + 6;
      const curMin = match.currentSimMinute;

      match.currentDisplayScoreHome = match.events.filter(e => e.team === 'home' && e.minute <= curMin).length;
      match.currentDisplayScoreAway = match.events.filter(e => e.team === 'away' && e.minute <= curMin).length;

      renderStageViewport();

      if (curMin >= 90) {
        clearInterval(activeSingleMatchIntervals[simKey]);
        delete activeSingleMatchIntervals[simKey];

        match.isLive = false;
        match.isSimulated = true;
        match.currentDisplayScoreHome = match.scoreHome;
        match.currentDisplayScoreAway = match.scoreAway;

        recalculateLeagueStandings(state);

        const allMdDone = state.matchdays[mdIdx].every(m => m.isSimulated);
        if (allMdDone) {
          state.currentMatchday = Math.max(state.currentMatchday, mdIdx + 1);
        }

        renderActiveTournament();
        if (state.champion) {
          triggerChampionCelebration(state.champion);
        }
      }
    }, 300);
  }

  function simulateLeagueMatchdayInstant(mdIdx) {
    const state = tournamentState[activeTournKey];
    if (!state.matchdays || !state.matchdays[mdIdx]) return;
    if (!isMatchdayUnlocked(state, mdIdx)) {
      const firstPending = getFirstPendingMatchdayIdx(state);
      state.selectedMatchday = firstPending;
      renderActiveTournament();
      return;
    }
    const matches = state.matchdays[mdIdx];

    matches.forEach(m => {
      if (!m.isSimulated) {
        const outcome = precomputeMatchResult(m.home, m.away, false);
        m.scoreHome = outcome.regHome;
        m.scoreAway = outcome.regAway;
        m.events = outcome.events;
        m.isLive = false;
        m.isSimulated = true;
        m.currentDisplayScoreHome = outcome.regHome;
        m.currentDisplayScoreAway = outcome.regAway;
      }
    });

    recalculateLeagueStandings(state);
    state.currentMatchday = Math.max(state.currentMatchday, mdIdx + 1);
    if (state.selectedMatchday < state.totalMatchdays - 1) {
      state.selectedMatchday = mdIdx + 1;
    }

    renderActiveTournament();
    if (state.champion) {
      triggerChampionCelebration(state.champion);
    }
  }

  // Label-only parser for skip/restart fallback — returns null instead of a default
  // so we never accidentally skip a stage that isn't running
  function getValidStageKeyFromLabel(rawLabel) {
    const txt = (rawLabel || '').trim().toUpperCase();
    if (txt.includes('MATCHDAY')) {
      // e.g. "LA LIGA • MATCHDAY 3 / 38" or "MATCHDAY 3"
      const m = txt.match(/MATCHDAY\s+(\d+)/);
      if (m) return `md_${parseInt(m[1], 10) - 1}`;
    }
    if (txt.includes('ROUND OF 32') || txt === 'R32') return 'r32';
    if (txt.includes('ROUND OF 16') || txt === 'R16') return 'r16';
    if (txt.includes('QUARTER') || txt === 'QF') return 'qf';
    if (txt.includes('SEMI') || txt === 'SF') return 'sf';
    if (txt.includes('FINAL') || txt === 'GF') return 'gf';
    return null; // Nothing recognizable → don't skip anything
  }


  function resolveGroupStage() {
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    if (!state || !state.groups) return;

    state.groupMatches = [];
    Object.keys(state.groups).forEach(letter => {
      const teams = state.groups[letter];
      teams.forEach(t => { t.mp = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.pts = 0; });

      const fixtures = [
        [0, 1], [2, 3],
        [0, 2], [1, 3],
        [0, 3], [1, 2]
      ];

      fixtures.forEach(([hIdx, aIdx]) => {
        const res = precomputeMatchResult(teams[hIdx].name, teams[aIdx].name, false);
        res.isSimulated = true;
        state.groupMatches.push(res);
        teams[hIdx].mp++;
        teams[aIdx].mp++;
        teams[hIdx].gf += res.regHome;
        teams[hIdx].ga += res.regAway;
        teams[aIdx].gf += res.regAway;
        teams[aIdx].ga += res.regHome;

        if (res.regHome > res.regAway) {
          teams[hIdx].w++; teams[hIdx].pts += 3;
          teams[aIdx].l++;
        } else if (res.regAway > res.regHome) {
          teams[aIdx].w++; teams[aIdx].pts += 3;
          teams[hIdx].l++;
        } else {
          teams[hIdx].d++; teams[hIdx].pts += 1;
          teams[aIdx].d++; teams[aIdx].pts += 1;
        }
      });

      teams.forEach(t => { t.gd = t.gf - t.ga; });
      teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
    });
    state.groupsPlayed = true;

    // Qualify teams to first knockout round
    const qualified = [];
    Object.keys(state.groups).forEach(letter => {
      qualified.push(state.groups[letter][0].name, state.groups[letter][1].name);
    });

    if (config.format === 'worldcup48') {
      // 48 teams in 12 groups -> 24 top 2 + 8 best 3rd placed teams = 32 teams to Round of 32
      const thirdBest = [];
      Object.keys(state.groups).forEach(letter => thirdBest.push(state.groups[letter][2]));
      thirdBest.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).slice(0, 8).forEach(t => qualified.push(t.name));
      const shuffled = [...qualified].sort(() => Math.random() - 0.5);
      state.r32 = [];
      for (let i = 0; i < 16; i++) {
        state.r32.push({ home: shuffled[i * 2], away: shuffled[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
    } else if (config.format === 'euro24' || config.format === 'uclLeaguePhase') {
      const pool = config.format === 'euro24' ? (function() {
        const thirdBest = [];
        Object.keys(state.groups).forEach(letter => thirdBest.push(state.groups[letter][2]));
        thirdBest.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf).slice(0, 4).forEach(t => qualified.push(t.name));
        return qualified;
      })() : qualified;
      const shuffled = [...pool].sort(() => Math.random() - 0.5);
      state.r16 = [];
      for (let i = 0; i < 8; i++) {
        state.r16.push({ home: shuffled[i * 2], away: shuffled[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
    } else {
      const shuffled = [...qualified].sort(() => Math.random() - 0.5);
      state.qf = [];
      for (let i = 0; i < 4; i++) {
        state.qf.push({ home: shuffled[i * 2], away: shuffled[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
    }
  }

  function triggerNextSimulationStep() {
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    if (!state) return;

    state.subView = 'sim';

    if (config.format === 'leagueSeason') {
      const targetMd = getFirstPendingMatchdayIdx(state);
      state.selectedMatchday = targetMd;
      simulateLeagueMatchdayWithClock(targetMd);
      scrollToStageSection('groups');
      return;
    }

    // Step 1: If Groups are not played, resolve groups and show the 32 qualifiers hub
    if (state.groups && !state.groupsPlayed) {
      resolveGroupStage();
      setStageTab('groups', true);
      return;
    }

    // Step 2: Round of 32
    if (state.r32 && state.r32.length > 0 && state.r32.some(m => !m.isSimulated)) {
      setStageTab('r32', true);
      simulateStageWithClock('r32');
      return;
    }

    // Step 3: Round of 16
    if (state.r16 && state.r16.length > 0 && state.r16.some(m => !m.isSimulated)) {
      setStageTab('r16', true);
      simulateStageWithClock('r16');
      return;
    }

    // Step 4: Quarterfinals
    if (state.qf && state.qf.length > 0 && state.qf.some(m => !m.isSimulated)) {
      setStageTab('qf', true);
      simulateStageWithClock('qf');
      return;
    }

    // Step 5: Semifinals
    if (state.sf && state.sf.length > 0 && state.sf.some(m => !m.isSimulated)) {
      setStageTab('sf', true);
      simulateStageWithClock('sf');
      return;
    }

    // Step 6: Grand Final
    if (state.gf && state.gf.length > 0 && !state.champion) {
      setStageTab('gf', true);
      simulateStageWithClock('gf');
      return;
    }
  }

  function ensureStagePrerequisites(stageKey) {
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    if (!state) return;

    if (stageKey === 'r32') {
      if (!state.groupsPlayed || !state.r32 || state.r32.length === 0) {
        resolveGroupStage();
      }
    } else if (stageKey === 'r16') {
      if (config.format === 'worldcup48') {
        ensureStagePrerequisites('r32');
        if (!state.r32 || state.r32.some(m => !m.isSimulated)) {
          (state.r32 || []).forEach(m => {
            if (!m.isSimulated) {
              Object.assign(m, precomputeMatchResult(m.home, m.away, true));
              m.isSimulated = true;
            }
          });
          progressToNextStage('r32');
        }
      } else {
        if (!state.groupsPlayed || !state.r16 || state.r16.length === 0) {
          resolveGroupStage();
        }
      }
    } else if (stageKey === 'qf') {
      if (config.format === 'copa16' || config.format === 'genericCup') {
        if (!state.groupsPlayed || !state.qf || state.qf.length === 0) {
          resolveGroupStage();
        }
      } else {
        ensureStagePrerequisites('r16');
        if (!state.r16 || state.r16.some(m => !m.isSimulated)) {
          (state.r16 || []).forEach(m => {
            if (!m.isSimulated) {
              Object.assign(m, precomputeMatchResult(m.home, m.away, true));
              m.isSimulated = true;
            }
          });
          progressToNextStage('r16');
        }
      }
    } else if (stageKey === 'sf') {
      ensureStagePrerequisites('qf');
      if (!state.qf || state.qf.some(m => !m.isSimulated)) {
        (state.qf || []).forEach(m => {
          if (!m.isSimulated) {
            Object.assign(m, precomputeMatchResult(m.home, m.away, true));
            m.isSimulated = true;
          }
        });
        progressToNextStage('qf');
      }
    } else if (stageKey === 'gf') {
      ensureStagePrerequisites('sf');
      if (!state.sf || state.sf.some(m => !m.isSimulated)) {
        (state.sf || []).forEach(m => {
          if (!m.isSimulated) {
            Object.assign(m, precomputeMatchResult(m.home, m.away, true));
            m.isSimulated = true;
          }
        });
        progressToNextStage('sf');
      }
    }
  }

  function simulateStageWithClock(stageKey) {
    cancelAllActiveSimulationTimers();
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    if (!state) return;

    state.subView = 'sim';

    // Auto-prepare all prerequisite stages recursively
    ensureStagePrerequisites(stageKey);

    let matches = state[stageKey] || [];
    if (matches.length === 0) return;

    if (matches.every(m => m.isSimulated)) {
      finalizeStageSimulation(stageKey);
      return;
    }

    scrollToStageSection(stageKey);

    // Precompute outcomes for all unsimulated matches in the stage
    matches.forEach(m => {
      if (!m.isSimulated) {
        const outcome = precomputeMatchResult(m.home, m.away, true);
        Object.assign(m, outcome);
        m.isLive = true;
        m.isSimulated = false;
        m.currentSimMinute = 0;
        m.currentDisplayScoreHome = 0;
        m.currentDisplayScoreAway = 0;
      }
    });

    const stageMeta = STAGE_META[stageKey] || { title: stageKey.toUpperCase() };
    activeSimulationClock.isRunning = true;
    activeSimulationClock.isPaused = false;
    activeSimulationClock.stageKey = stageKey;
    activeSimulationClock.currentSimMinute = 0;
    activeSimulationClock.activeMatches = matches;
    activeSimulationClock.totalSimMinutes = 90;
    activeSimulationClock.realDurationMs = 30000;
    activeSimulationClock.startTime = Date.now();
    activeSimulationClock.elapsedBeforePause = 0;

    const clockHud = document.getElementById('sim-clock-hud');
    const liveControlBar = document.getElementById('live-control-bar');
    const stageLabel = document.getElementById('clock-stage-label');
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resumeBtn = document.getElementById('sim-resume-btn');

    if (clockHud) clockHud.hidden = false;
    if (liveControlBar) liveControlBar.hidden = false;
    if (stageLabel) {
      stageLabel.textContent = stageMeta.title;
      stageLabel.dataset.stageKey = stageKey;
    }
    if (pauseBtn) pauseBtn.hidden = false;
    if (resumeBtn) resumeBtn.hidden = true;

    const stageActionBtn = document.getElementById('sim-stage-action-btn');
    if (stageActionBtn) {
      stageActionBtn.textContent = `🔴 SIMULATING ${stageMeta.title}...`;
      stageActionBtn.disabled = true;
    }

    renderStageViewport();

    // Responsive interval: increments simulated clock smoothly
    activeSimulationInterval = setInterval(() => {
      if (activeSimulationClock.isPaused) return;

      activeSimulationClock.currentSimMinute += 3.75;
      const curMin = Math.floor(activeSimulationClock.currentSimMinute);

      const minText = document.getElementById('clock-minute-text');
      const progressFill = document.getElementById('clock-progress-fill');
      if (minText) {
        let halfText = 'FIRST HALF';
        if (curMin >= 45 && curMin < 90) halfText = 'SECOND HALF';
        else if (curMin >= 90) halfText = 'FULL TIME';
        minText.textContent = `${Math.min(90, curMin)}' (${halfText})`;
      }
      if (progressFill) progressFill.style.width = `${Math.min(100, (curMin / 90) * 100)}%`;

      // Update match scores as goal events occur
      matches.forEach(m => {
        if (m.isLive) {
          m.currentSimMinute = curMin;
          m.currentDisplayScoreHome = m.events.filter(e => e.team === 'home' && e.minute <= curMin).length;
          m.currentDisplayScoreAway = m.events.filter(e => e.team === 'away' && e.minute <= curMin).length;
        }
      });

      // Update live ticker log
      const currentGoals = [];
      matches.forEach(m => {
        const ev = m.events.find(e => e.minute >= curMin - 3 && e.minute <= curMin);
        if (ev) currentGoals.push(`⚽ GOAL! ${ev.teamName}: ${ev.player} (${ev.minute}')`);
      });
      if (currentGoals.length > 0) {
        const tickerEl = document.getElementById('bracket-ticker-text');
        if (tickerEl) tickerEl.textContent = `${stageMeta.title}: ${currentGoals.join(' | ')} // `;
      }

      renderStageViewport();

      if (curMin >= 90) {
        finalizeStageSimulation(stageKey);
      }
    }, 250);
  }

  function simulateSingleMatch(stageKey, matchIdx) {
    const state = tournamentState[activeTournKey];
    const match = state[stageKey]?.[matchIdx];
    if (!match || match.isSimulated || match.isLive) return;

    // Precompute outcome if not already generated
    if (!match.winner) {
      const outcome = precomputeMatchResult(match.home, match.away, true);
      Object.assign(match, outcome);
    }

    match.isLive = true;
    match.isSimulated = false;
    match.currentSimMinute = 0;
    match.currentDisplayScoreHome = 0;
    match.currentDisplayScoreAway = 0;
    renderActiveTournament();

    const simKey = `${stageKey}_${matchIdx}`;
    if (activeSingleMatchIntervals[simKey]) {
      clearInterval(activeSingleMatchIntervals[simKey]);
    }

    const totalTargetMinutes = match.hadExtraTime ? 120 : 90;
    // Step by 4 simulated minutes every 100ms
    activeSingleMatchIntervals[simKey] = setInterval(() => {
      match.currentSimMinute = (match.currentSimMinute || 0) + 4;
      const curMin = match.currentSimMinute;

      // Update live display scores
      match.currentDisplayScoreHome = match.events.filter(e => e.team === 'home' && e.minute <= curMin).length;
      match.currentDisplayScoreAway = match.events.filter(e => e.team === 'away' && e.minute <= curMin).length;

      // Update ticker with goal event
      const recentGoal = match.events.find(e => e.minute >= curMin - 8 && e.minute <= curMin);
      if (recentGoal) {
        const tickerEl = document.getElementById('bracket-ticker-text');
        if (tickerEl) {
          const goalType = (recentGoal.type && recentGoal.type.includes('ET')) || recentGoal.minute > 90 ? ' (ET)' : '';
          tickerEl.textContent = `⚡ GOAL! ${recentGoal.teamName || 'Goal'}: ${recentGoal.player || 'Player'}${goalType} (${recentGoal.minute}') // `;
        }
      }

      // Animate live timer progress
      const maxMin = match.hadExtraTime ? 120 : 90;
      const pct = Math.min(100, Math.round((curMin / maxMin) * 100));
      const timerEl = document.querySelector(`[data-stage="${stageKey}"] .card-live-progress-fill`);
      if (timerEl) timerEl.style.width = `${pct}%`;

      renderActiveTournament();

      if (curMin >= totalTargetMinutes) {
        clearInterval(activeSingleMatchIntervals[simKey]);
        delete activeSingleMatchIntervals[simKey];

        match.isLive = false;
        match.isSimulated = true;
        match.currentDisplayScoreHome = match.scoreHome;
        match.currentDisplayScoreAway = match.scoreAway;

        const tickerEl = document.getElementById('bracket-ticker-text');
        if (tickerEl) {
          const extraInfo = match.hadPenalties ? ` (${match.penHome}-${match.penAway} PENS)` : (match.hadExtraTime ? ' (AET)' : ' (FT)');
          tickerEl.textContent = `RESULT: ${match.home} ${match.scoreHome} - ${match.scoreAway} ${match.away}${extraInfo} // `;
        }

        // Show stage completion toast
        showStageAdvancementToast(stageKey);

        // Add goal pulse animation to scored events
        document.querySelectorAll(`[data-stage="${stageKey}"] .match-event-row`).forEach(el => {
          el.classList.add('goal-event');
        });

        const allDone = (state[stageKey] || []).every(m => m.isSimulated);
        if (allDone) {
          progressToNextStage(stageKey);
        }
        renderActiveTournament();
      }
    }, 100);
  }

  function finalizeStageSimulation(stageKey) {
    cancelAllActiveSimulationTimers();
    const state = tournamentState[activeTournKey];
    const matches = state[stageKey] || [];
    matches.forEach(m => {
      if (!m.winner || m.scoreHome === null || m.scoreHome === undefined || m.scoreHome === '–') {
        const outcome = precomputeMatchResult(m.home, m.away, true);
        Object.assign(m, outcome);
      }
      m.isLive = false;
      m.isSimulated = true;
      m.currentDisplayScoreHome = m.scoreHome;
      m.currentDisplayScoreAway = m.scoreAway;
    });

    const clockHud = document.getElementById('sim-clock-hud');
    const liveControlBar = document.getElementById('live-control-bar');
    if (clockHud) clockHud.hidden = true;
    if (liveControlBar) liveControlBar.hidden = true;

    const stageMeta = STAGE_META[stageKey] || { title: stageKey.toUpperCase() };
    const tickerEl = document.getElementById('bracket-ticker-text');
    if (tickerEl) {
      tickerEl.textContent = `COMPLETED: ${stageMeta.title} fixtures resolved! // `;
    }

    progressToNextStage(stageKey);

    let nextStage = null;
    if (stageKey === 'r32') nextStage = 'r16';
    else if (stageKey === 'r16') nextStage = 'qf';
    else if (stageKey === 'qf') nextStage = 'sf';
    else if (stageKey === 'sf') nextStage = 'gf';

    if (nextStage) {
      setStageTab(nextStage, true);
    } else {
      renderActiveTournament();
    }
  }

  function showStageAdvancementToast(stageKey) {
    const toast = document.getElementById('stage-advance-toast');
    const toastTitle = document.getElementById('toast-title');
    const toastDesc = document.getElementById('toast-desc');
    if (!toast || !toastTitle || !toastDesc) return;

    if (stageKey === 'r32') {
      toastTitle.textContent = '✨ ROUND OF 32 RESOLVED!';
      toastDesc.textContent = '16 Contenders advance to the Round of 16!';
    } else if (stageKey === 'r16') {
      toastTitle.textContent = '⚡ ROUND OF 16 RESOLVED!';
      toastDesc.textContent = '8 Elite teams advance to the Quarterfinals!';
    } else if (stageKey === 'qf') {
      toastTitle.textContent = '🔥 QUARTERFINALS COMPLETED!';
      toastDesc.textContent = '4 Titans advance to the Semifinals!';
    } else if (stageKey === 'sf') {
      toastTitle.textContent = '🏆 SEMIFINALS COMPLETED!';
      toastDesc.textContent = 'The Grand Final matchup is set for World Glory!';
    }

    toast.hidden = false;
    setTimeout(() => {
      toast.hidden = true;
    }, 4500);
  }

  let confettiAnimationId = null;
  function startConfettiAnimation() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    canvas.width = canvas.parentElement?.offsetWidth || 600;
    canvas.height = canvas.parentElement?.offsetHeight || 500;

    const colors = ['#FFC94A', '#2ECC71', '#58D68D', '#FFE082', '#E74C3C', '#FFFFFF'];
    const particles = [];
    for (let i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 50,
        y: canvas.height / 3 + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (confettiAnimationId) cancelAnimationFrame(confettiAnimationId);

    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.25; // gravity
        p.rotation += p.rotSpeed;
        p.opacity -= 0.005;

        if (p.opacity > 0 && p.y < canvas.height + 20) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(0, p.opacity);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.5);
          ctx.restore();
        }
      });

      if (alive) {
        confettiAnimationId = requestAnimationFrame(frame);
      }
    }
    frame();
  }

  function triggerChampionCelebration(champTeam) {
    const modal = document.getElementById('champion-modal');
    const nameEl = document.getElementById('champ-modal-name');
    const flagEl = document.getElementById('champ-modal-flag');
    const tournEl = document.getElementById('champ-modal-tourn');
    const headlineEl = document.getElementById('champ-modal-headline');
    const taglineEl = document.getElementById('champ-modal-tagline');
    const trophyEl = document.getElementById('champ-modal-trophy');
    const statsRow = document.getElementById('champ-stats-row');
    const config = TOURNAMENTS_CONFIG[activeTournKey] || { name: 'TOURNAMENT' };
    const state = tournamentState[activeTournKey] || {};

    if (!modal) return;

    if (nameEl) nameEl.textContent = champTeam.toUpperCase();
    if (tournEl) tournEl.textContent = config.name;
    if (flagEl) {
      flagEl.innerHTML = getTeamLogoHtml(champTeam);
    }

    // Dynamic Context-Aware Headlines and Taglines per Competition
    const isLeague = config.type === 'league' || config.format === 'leagueSeason';
    const isInternational = config.strengthType === 'national' || activeTournKey === 'wc' || activeTournKey === 'euro' || activeTournKey === 'copa';

    if (headlineEl) {
      if (activeTournKey === 'wc') {
        headlineEl.textContent = 'WORLD CHAMPIONS CROWNED!';
      } else if (activeTournKey === 'euro') {
        headlineEl.textContent = 'CHAMPIONS OF EUROPE CROWNED!';
      } else if (activeTournKey === 'copa') {
        headlineEl.textContent = 'COPA AMÉRICA CHAMPIONS CROWNED!';
      } else if (activeTournKey === 'ucl') {
        headlineEl.textContent = 'KINGS OF EUROPE CROWNED!';
      } else if (activeTournKey === 'pl') {
        headlineEl.textContent = 'PREMIER LEAGUE CHAMPIONS CROWNED!';
      } else if (activeTournKey === 'laliga') {
        headlineEl.textContent = 'CAMPEONES DE ESPAÑA!';
      } else if (activeTournKey === 'serieA') {
        headlineEl.textContent = 'SCUDETTO CHAMPIONS CROWNED!';
      } else if (activeTournKey === 'bundesliga') {
        headlineEl.textContent = 'DEUTSCHER MEISTER GEKRÖNT!';
      } else if (activeTournKey === 'ligue1') {
        headlineEl.textContent = 'CHAMPIONS DE FRANCE!';
      } else {
        headlineEl.textContent = `${config.name} CHAMPIONS!`;
      }
    }

    if (taglineEl) {
      if (activeTournKey === 'wc') {
        taglineEl.textContent = 'GLORIOUS CHAMPIONS OF THE WORLD';
      } else if (activeTournKey === 'euro') {
        taglineEl.textContent = 'GLORIOUS CHAMPIONS OF EUROPE';
      } else if (activeTournKey === 'copa') {
        taglineEl.textContent = 'SUPREME KINGS OF THE AMÉRICAS';
      } else if (activeTournKey === 'ucl') {
        taglineEl.textContent = 'UEFA CHAMPIONS LEAGUE TITANS';
      } else if (activeTournKey === 'pl') {
        taglineEl.textContent = 'SUPREME CHAMPIONS OF ENGLISH FOOTBALL';
      } else if (activeTournKey === 'laliga') {
        taglineEl.textContent = 'GLORIOUS WINNERS OF LA LIGA';
      } else if (activeTournKey === 'serieA') {
        taglineEl.textContent = 'OFFICIAL SCUDETTO WINNERS';
      } else if (activeTournKey === 'bundesliga') {
        taglineEl.textContent = 'MEISTERSCHALE TITLE WINNERS';
      } else {
        taglineEl.textContent = `GLORIOUS CHAMPIONS OF ${config.name}`;
      }
    }

    if (trophyEl) {
      trophyEl.textContent = activeTournKey === 'ucl' ? '⭐' : '🏆';
    }

    // Comprehensive goal and scorer statistics across all formats
    let totalGoals = 0;
    const tournamentScorers = {};
    let champTotalGoals = 0;
    let champMatchesCount = 0;
    const champScorers = {};
    const champNorm = (champTeam || '').trim().toUpperCase();

    function processMatch(m) {
      if (!m || !m.isSimulated) return;
      const hScore = typeof m.scoreHome === 'number' ? m.scoreHome : parseInt(m.scoreHome, 10) || 0;
      const aScore = typeof m.scoreAway === 'number' ? m.scoreAway : parseInt(m.scoreAway, 10) || 0;
      totalGoals += hScore + aScore;

      const homeNorm = (m.home || '').trim().toUpperCase();
      const awayNorm = (m.away || '').trim().toUpperCase();
      const isChampHome = homeNorm === champNorm || (homeNorm && champNorm && (homeNorm.includes(champNorm) || champNorm.includes(homeNorm)));
      const isChampAway = awayNorm === champNorm || (awayNorm && champNorm && (awayNorm.includes(champNorm) || champNorm.includes(awayNorm)));

      if (isChampHome) {
        champMatchesCount++;
        champTotalGoals += hScore;
      } else if (isChampAway) {
        champMatchesCount++;
        champTotalGoals += aScore;
      }

      if (m.events && Array.isArray(m.events)) {
        m.events.forEach(ev => {
          if (ev.player) {
            tournamentScorers[ev.player] = (tournamentScorers[ev.player] || 0) + 1;

            const evTeamNorm = (ev.teamName || '').trim().toUpperCase();
            const isChampEvent = evTeamNorm === champNorm ||
                                 (ev.team === 'home' && isChampHome) ||
                                 (ev.team === 'away' && isChampAway) ||
                                 (evTeamNorm && champNorm && (evTeamNorm.includes(champNorm) || champNorm.includes(evTeamNorm)));

            if (isChampEvent) {
              champScorers[ev.player] = (champScorers[ev.player] || 0) + 1;
            }
          }
        });
      }
    }

    // 1. League Season format (38 / 34 matchdays)
    if (state.matchdays && Array.isArray(state.matchdays)) {
      state.matchdays.forEach(round => {
        if (Array.isArray(round)) round.forEach(processMatch);
      });
    }

    // Check league table for exact stats if matchdays array isn't fully expanded
    if (state.leagueTable && Array.isArray(state.leagueTable)) {
      const champRow = state.leagueTable.find(r => (r.club || '').trim().toUpperCase() === champNorm || champNorm.includes((r.club || '').trim().toUpperCase()));
      if (champRow) {
        if (champRow.gf && champRow.gf > champTotalGoals) champTotalGoals = champRow.gf;
        if (champRow.mp && champRow.mp > champMatchesCount) champMatchesCount = champRow.mp;
      }
    }

    // 2. Group stage format
    if (state.groupMatches && Array.isArray(state.groupMatches) && state.groupMatches.length > 0) {
      state.groupMatches.forEach(processMatch);
    } else if (state.groups && typeof state.groups === 'object') {
      Object.keys(state.groups).forEach(letter => {
        const teams = state.groups[letter] || [];
        teams.forEach(t => {
          totalGoals += (t.gf || 0);
          const tNorm = (t.name || '').trim().toUpperCase();
          if (tNorm === champNorm || champNorm.includes(tNorm)) {
            champTotalGoals += (t.gf || 0);
            champMatchesCount += (t.mp || 3);
          }
        });
      });
    }

    // 3. Knockout stages (R32, R16, QF, SF, GF)
    const stages = ['r32', 'playoffs', 'r16', 'qf', 'sf', 'gf'];
    stages.forEach(st => {
      if (state[st] && Array.isArray(state[st])) {
        state[st].forEach(processMatch);
      }
    });

    // 4. Calculate Average Goals Per Match for Champion
    const safeMatches = Math.max(champMatchesCount, 1);
    const avgGoalsPerMatch = (champTotalGoals / safeMatches).toFixed(2);

    // 5. Determine Champion's Top Scorer (Team Top Scorer)
    let champTopScorerName = '';
    let champTopScorerGoals = 0;
    const sortedChampScorers = Object.entries(champScorers).sort((a, b) => b[1] - a[1]);

    if (sortedChampScorers.length > 0) {
      champTopScorerName = sortedChampScorers[0][0];
      champTopScorerGoals = sortedChampScorers[0][1];
    } else {
      // Randomized authentic team player fallback
      champTopScorerName = getRandomPlayerForTeam(champTeam);
      champTopScorerGoals = isLeague ? Math.max(12, Math.round(champTotalGoals * 0.28)) : Math.max(3, Math.round(champTotalGoals * 0.40));
    }

    // 6. Determine Tournament Top Scorer (Golden Boot)
    let tournTopScorerName = '';
    let tournTopScorerGoals = 0;
    const sortedTournScorers = Object.entries(tournamentScorers).sort((a, b) => b[1] - a[1]);

    if (sortedTournScorers.length > 0) {
      tournTopScorerName = sortedTournScorers[0][0];
      tournTopScorerGoals = sortedTournScorers[0][1];
    } else {
      const realTopScorers = window.REAL_TOURNAMENTS_DATA?.[activeTournKey]?.topScorers || [];
      if (realTopScorers.length > 0) {
        tournTopScorerName = realTopScorers[0].name;
        tournTopScorerGoals = realTopScorers[0].goals || (isLeague ? 24 : 6);
      } else {
        tournTopScorerName = champTopScorerName;
        tournTopScorerGoals = champTopScorerGoals;
      }
    }

    // Inject champion-specific stats inside the hero logo container
    const heroStatsEl = document.getElementById('champ-hero-stats');
    if (heroStatsEl) {
      heroStatsEl.innerHTML = `
        <div class="champ-hero-stat-badge">
          <span class="badge-icon">⚡</span>
          <div class="badge-info">
            <span class="badge-val">${avgGoalsPerMatch} <span style="font-size:0.75rem; color:var(--text-muted);">(${champTotalGoals}G)</span></span>
            <span class="badge-label">AVG GOALS / MATCH</span>
          </div>
        </div>
        <div class="champ-hero-stat-badge">
          <span class="badge-icon">⚽</span>
          <div class="badge-info">
            <span class="badge-val">${champTopScorerName} (${champTopScorerGoals})</span>
            <span class="badge-label">TEAM TOP SCORER</span>
          </div>
        </div>
      `;
    }

    // Inject tournament-wide context in the row below
    if (statsRow) {
      statsRow.innerHTML = `
        <div class="champ-stat-pill">
          <div class="champ-stat-val">${tournTopScorerName} (${tournTopScorerGoals})</div>
          <div class="champ-stat-lbl">🥇 TOURNAMENT GOLDEN BOOT</div>
        </div>
        <div class="champ-stat-pill">
          <div class="champ-stat-val">${totalGoals > 0 ? totalGoals : (isLeague ? '940+' : '142')}</div>
          <div class="champ-stat-lbl">⚽ TOTAL TOURNAMENT GOALS</div>
        </div>
      `;
    }

    modal.hidden = false;
    startConfettiAnimation();
  }

  function progressToNextStage(stageKey) {
    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    if (!state) return;

    if (stageKey === 'r32') {
      const winners = (state.r32 || []).map(m => {
        if (!m.winner) {
          const outcome = precomputeMatchResult(m.home, m.away, true);
          Object.assign(m, outcome);
          m.isSimulated = true;
        }
        return m.winner;
      });
      state.r16 = [];
      for (let i = 0; i < 8; i++) {
        state.r16.push({ home: winners[i * 2], away: winners[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
      showStageAdvancementToast('r32');
    } else if (stageKey === 'r16') {
      const winners = (state.r16 || []).map(m => {
        if (!m.winner) {
          const outcome = precomputeMatchResult(m.home, m.away, true);
          Object.assign(m, outcome);
          m.isSimulated = true;
        }
        return m.winner;
      });
      state.qf = [];
      for (let i = 0; i < 4; i++) {
        state.qf.push({ home: winners[i * 2], away: winners[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
      showStageAdvancementToast('r16');
    } else if (stageKey === 'qf') {
      const winners = (state.qf || []).map(m => {
        if (!m.winner) {
          const outcome = precomputeMatchResult(m.home, m.away, true);
          Object.assign(m, outcome);
          m.isSimulated = true;
        }
        return m.winner;
      });
      state.sf = [];
      for (let i = 0; i < 2; i++) {
        state.sf.push({ home: winners[i * 2], away: winners[i * 2 + 1], scoreHome: '–', scoreAway: '–', isSimulated: false });
      }
      showStageAdvancementToast('qf');
    } else if (stageKey === 'sf') {
      const winners = (state.sf || []).map(m => {
        if (!m.winner) {
          const outcome = precomputeMatchResult(m.home, m.away, true);
          Object.assign(m, outcome);
          m.isSimulated = true;
        }
        return m.winner;
      });
      state.gf = [{ home: winners[0], away: winners[1], scoreHome: '–', scoreAway: '–', isSimulated: false }];
      showStageAdvancementToast('sf');
    } else if (stageKey === 'gf') {
      if (state.gf && state.gf[0]) {
        if (!state.gf[0].winner) {
          const outcome = precomputeMatchResult(state.gf[0].home, state.gf[0].away, true);
          Object.assign(state.gf[0], outcome);
          state.gf[0].isSimulated = true;
        }
        state.champion = state.gf[0].winner;
      }
      const tickerEl = document.getElementById('bracket-ticker-text');
      if (tickerEl) {
        tickerEl.textContent = `🏆 CHAMPION CROWNED: ${state.champion} wins the ${config.name}! // `;
      }
      triggerChampionCelebration(state.champion);
    }
  }

  // ---------------------------------------------------------------------------
  // 9. INSTANT & STAGE SIMULATION BUTTON TRIGGERS
  // ---------------------------------------------------------------------------
  function setupSimulationControls() {
    // 10-Competition Selection Bar
    document.querySelectorAll('.comp-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        selectTournament(tab.dataset.tourn);
      });
    });

    // Stage Filter Tabs - Direct Navigation & Smooth Scroll
    document.querySelectorAll('#stage-tabs-group .bracket-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const stage = tab.dataset.stage || 'all';
        setStageTab(stage, true);
      });
    });

    // Reset / Draw Button
    const drawBtn = document.getElementById('sim-draw-btn');
    if (drawBtn) {
      drawBtn.addEventListener('click', () => {
        // Stop any running simulation and timer
        leagueAutoSimActive = false;
        cancelAllActiveSimulationTimers();

        // Reset HUD and live control UI
        const clockHud = document.getElementById('sim-clock-hud');
        if (clockHud) clockHud.hidden = true;
        const liveControlBar = document.getElementById('live-control-bar');
        if (liveControlBar) liveControlBar.hidden = true;
        const pauseBtn = document.getElementById('sim-pause-btn');
        if (pauseBtn) pauseBtn.hidden = false;
        const resumeBtn = document.getElementById('sim-resume-btn');
        if (resumeBtn) resumeBtn.hidden = true;
        const instantBtn = document.getElementById('sim-instant-btn');
        if (instantBtn) {
          instantBtn.textContent = '🏆 FULL SIM';
          instantBtn.classList.remove('active-full-sim');
        }

        // Hide any modal or celebration banners
        const champModal = document.getElementById('champion-modal');
        if (champModal) champModal.hidden = true;
        const champBanner = document.getElementById('champion-banner');
        if (champBanner) champBanner.hidden = true;
        const toast = document.getElementById('stage-advance-toast');
        if (toast) toast.hidden = true;

        // Clean state reset
        initTournamentState(activeTournKey);
        setStageTab('all', false);

        // Keep current view preference (e.g. simulator view)
        const config = TOURNAMENTS_CONFIG[activeTournKey];
        if (config.format === 'leagueSeason') {
          tournamentState[activeTournKey].subView = 'sim';
        }

        // Render clean unsimulated state
        renderActiveTournament();

        const tickerEl = document.getElementById('bracket-ticker-text');
        if (tickerEl) {
          tickerEl.textContent = `TOURNAMENT RESET // Ready to simulate ${config.name}! // `;
        }
      });
    }

    // Stage Action Button
    const stageActionBtn = document.getElementById('sim-stage-action-btn');
    if (stageActionBtn) {
      stageActionBtn.addEventListener('click', () => {
        triggerNextSimulationStep();
      });
    }

    // Live Pause / Resume / Restart / Skip Buttons
    const pauseBtn = document.getElementById('sim-pause-btn');
    const resumeBtn = document.getElementById('sim-resume-btn');
    const restartBtn = document.getElementById('sim-restart-btn');
    const skipBtn = document.getElementById('sim-skip-btn');

    if (pauseBtn && resumeBtn) {
      pauseBtn.addEventListener('click', () => {
        activeSimulationClock.isPaused = true;
        pauseBtn.hidden = true;
        resumeBtn.hidden = false;
      });
      resumeBtn.addEventListener('click', () => {
        activeSimulationClock.isPaused = false;
        pauseBtn.hidden = false;
        resumeBtn.hidden = true;
      });
    }

    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        leagueAutoSimActive = false;
        const stageKey = activeSimulationClock.stageKey
          || getValidStageKeyFromLabel(document.getElementById('clock-stage-label')?.textContent);
        if (!stageKey) return;
        if (stageKey.startsWith('md_')) {
          const mdIdx = parseInt(stageKey.replace('md_', ''), 10);
          if (!isNaN(mdIdx)) simulateLeagueMatchdayWithClock(mdIdx);
        } else {
          simulateStageWithClock(stageKey);
        }
      });
    }

    if (skipBtn) {
      skipBtn.addEventListener('click', () => {
        // Read stageKey from the clock first, then fall back to the label text
        const stageKey = activeSimulationClock.stageKey
          || getValidStageKeyFromLabel(document.getElementById('clock-stage-label')?.textContent);

        // Nothing to skip if no stage is active
        if (!stageKey && !leagueAutoSimActive) return;

        if (leagueAutoSimActive || (stageKey && stageKey.startsWith('md_'))) {
          // --- FULL SIM or single-matchday skip ---
          // Stop everything immediately
          const wasFullSim = leagueAutoSimActive;
          leagueAutoSimActive = false;
          cancelAllActiveSimulationTimers();

          const state = tournamentState[activeTournKey];

          if (wasFullSim) {
            // Full Sim skip: instantly complete ALL remaining matchdays
            state.matchdays.forEach((matches, idx) => {
              matches.forEach(m => {
                if (!m.isSimulated) {
                  if (m.scoreHome === null || m.scoreHome === undefined) {
                    const outcome = precomputeMatchResult(m.home, m.away, false);
                    m.scoreHome = outcome.regHome;
                    m.scoreAway = outcome.regAway;
                    m.events = outcome.events || [];
                  }
                  m.isLive = false;
                  m.isSimulated = true;
                  m.currentDisplayScoreHome = m.scoreHome;
                  m.currentDisplayScoreAway = m.scoreAway;
                }
              });
            });
            recalculateLeagueStandings(state);
            state.currentMatchday = state.totalMatchdays;
            state.selectedMatchday = state.totalMatchdays - 1;

            // Reset Full Sim button
            const instantBtnEl = document.getElementById('sim-instant-btn');
            if (instantBtnEl) {
              instantBtnEl.textContent = '🏆 FULL SIM';
              instantBtnEl.classList.remove('active-full-sim');
            }
          } else {
            // Single-matchday skip: finalize only the current matchday
            const mdIdx = parseInt(stageKey.replace('md_', ''), 10);
            if (state.matchdays && state.matchdays[mdIdx]) {
              state.matchdays[mdIdx].forEach(m => {
                if (!m.isSimulated) {
                  if (m.scoreHome === null || m.scoreHome === undefined) {
                    const outcome = precomputeMatchResult(m.home, m.away, false);
                    m.scoreHome = outcome.regHome;
                    m.scoreAway = outcome.regAway;
                    m.events = outcome.events || [];
                  }
                  m.isLive = false;
                  m.isSimulated = true;
                  m.currentDisplayScoreHome = m.scoreHome;
                  m.currentDisplayScoreAway = m.scoreAway;
                }
              });
              recalculateLeagueStandings(state);
              state.currentMatchday = Math.max(state.currentMatchday, mdIdx + 1);
              if (state.selectedMatchday < state.totalMatchdays - 1) state.selectedMatchday = mdIdx + 1;
            }
          }

          const progressBar = document.getElementById('matchday-progress-bar');
          if (progressBar) progressBar.remove();
          renderActiveTournament();
          if (state.champion) triggerChampionCelebration(state.champion);

        } else if (stageKey) {
          // --- Knockout stage skip ---
          leagueAutoSimActive = false;
          finalizeStageSimulation(stageKey);
        }
      });
    }

    // Instant Full Simulation
    const instantBtn = document.getElementById('sim-instant-btn');
    if (instantBtn) {
      instantBtn.addEventListener('click', () => {
        const config = TOURNAMENTS_CONFIG[activeTournKey];

        if (config.format === 'leagueSeason') {
          // If Full Sim chain is already running, stop it
          if (leagueAutoSimActive) {
            leagueAutoSimActive = false;
            cancelAllActiveSimulationTimers();
            const instantBtnEl = document.getElementById('sim-instant-btn');
            if (instantBtnEl) {
              instantBtnEl.textContent = '🏆 FULL SIM';
              instantBtnEl.classList.remove('active-full-sim');
            }
            return;
          }
          // Start chained 1-min clock simulation for all matchdays
          cancelAllActiveSimulationTimers(); // Stop any running clock before resetting
          initTournamentState(activeTournKey);
          tournamentState[activeTournKey].subView = 'sim';
          renderActiveTournament();
          setTimeout(() => simulateAllLeagueMatchdaysWithClock(0), 300);
          return;
        }

        // --- Knockout / Cup Format: Instant Full Resolution ---
        cancelAllActiveSimulationTimers(); // Stop any running clock before resetting
        initTournamentState(activeTournKey);
        const state = tournamentState[activeTournKey]; // Declare state here—accessible for champion check below
        state.subView = 'sim'; // Always show bracket, not home page

        // Instant resolution across all tournament stages
        if (state.groups) {
          state.groupMatches = [];
          Object.keys(state.groups).forEach(letter => {
            const teams = state.groups[letter];
            teams.forEach(t => { t.mp = 0; t.w = 0; t.d = 0; t.l = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.pts = 0; });
            const fixtures = [
              [0, 1], [2, 3],
              [0, 2], [1, 3],
              [0, 3], [1, 2]
            ];
            fixtures.forEach(([hIdx, aIdx]) => {
              const res = precomputeMatchResult(teams[hIdx].name, teams[aIdx].name, false);
              res.isSimulated = true;
              state.groupMatches.push(res);
              teams[hIdx].mp++;
              teams[aIdx].mp++;
              teams[hIdx].gf += res.regHome;
              teams[hIdx].ga += res.regAway;
              teams[aIdx].gf += res.regAway;
              teams[aIdx].ga += res.regHome;

              if (res.regHome > res.regAway) {
                teams[hIdx].w++; teams[hIdx].pts += 3;
                teams[aIdx].l++;
              } else if (res.regAway > res.regHome) {
                teams[aIdx].w++; teams[aIdx].pts += 3;
                teams[hIdx].l++;
              } else {
                teams[hIdx].d++; teams[hIdx].pts += 1;
                teams[aIdx].d++; teams[aIdx].pts += 1;
              }
            });
            teams.forEach(t => { t.gd = t.gf - t.ga; });
            teams.sort((a, b) => b.pts - a.pts || b.gd - a.gd || b.gf - a.gf);
          });
          state.groupsPlayed = true;
        }

        const qualified = [];
        if (state.groups) {
          Object.keys(state.groups).forEach(letter => {
            qualified.push(state.groups[letter][0].name, state.groups[letter][1].name);
          });
        }

        if (config.format === 'worldcup48') {
          const thirdBest = [];
          Object.keys(state.groups).forEach(letter => thirdBest.push(state.groups[letter][2]));
          thirdBest.sort((a, b) => b.pts - a.pts || b.gd - a.gd).slice(0, 8).forEach(t => qualified.push(t.name));
          const shuffled = [...qualified].sort(() => Math.random() - 0.5);

          // Simulate R32
          state.r32 = [];
          for (let i = 0; i < 16; i++) {
            const m = precomputeMatchResult(shuffled[i * 2], shuffled[i * 2 + 1], true);
            m.isSimulated = true;
            state.r32.push(m);
          }

          // Simulate R16
          const r32Winners = state.r32.map(m => m.winner);
          state.r16 = [];
          for (let i = 0; i < 8; i++) {
            const m = precomputeMatchResult(r32Winners[i * 2], r32Winners[i * 2 + 1], true);
            m.isSimulated = true;
            state.r16.push(m);
          }
        } else if (config.format === 'euro24' || config.format === 'uclLeaguePhase') {
          const pool = config.format === 'euro24' ? (function() {
            const thirdBest = [];
            Object.keys(state.groups).forEach(letter => thirdBest.push(state.groups[letter][2]));
            thirdBest.sort((a, b) => b.pts - a.pts).slice(0, 4).forEach(t => qualified.push(t.name));
            return qualified;
          })() : qualified;
          const shuffled = [...pool].sort(() => Math.random() - 0.5);
          state.r16 = [];
          for (let i = 0; i < 8; i++) {
            const m = precomputeMatchResult(shuffled[i * 2], shuffled[i * 2 + 1], true);
            m.isSimulated = true;
            state.r16.push(m);
          }
        }

        // Simulate QF
        const r16Winners = (state.r16 && state.r16.length > 0)
          ? state.r16.map(m => m.winner)
          : [...qualified].sort(() => Math.random() - 0.5).slice(0, 8);

        state.qf = [];
        for (let i = 0; i < 4; i++) {
          const m = precomputeMatchResult(r16Winners[i * 2], r16Winners[i * 2 + 1], true);
          m.isSimulated = true;
          state.qf.push(m);
        }

        // Simulate SF
        const qfWinners = state.qf.map(m => m.winner);
        state.sf = [];
        for (let i = 0; i < 2; i++) {
          const m = precomputeMatchResult(qfWinners[i * 2], qfWinners[i * 2 + 1], true);
          m.isSimulated = true;
          state.sf.push(m);
        }

        // Simulate GF
        const sfWinners = state.sf.map(m => m.winner);
        const finalMatch = precomputeMatchResult(sfWinners[0], sfWinners[1], true);
        finalMatch.isSimulated = true;
        state.gf = [finalMatch];
        state.champion = finalMatch.winner;

        state.subView = 'sim';
        renderActiveTournament();
        if (state.champion) {
          triggerChampionCelebration(state.champion);
        }
      });
    }

    // Championship Celebration Modal Listeners
    const champModal = document.getElementById('champion-modal');
    const champCloseBtn = document.getElementById('champ-modal-close');
    const champBackdrop = document.getElementById('champ-modal-backdrop');
    const champViewBracketBtn = document.getElementById('champ-view-bracket-btn');
    const champConfettiBtn = document.getElementById('champ-confetti-btn');

    function closeChampModal(e) {
      if (e && e.preventDefault) e.preventDefault();
      const modalEl = document.getElementById('champion-modal');
      if (modalEl) modalEl.hidden = true;
      if (confettiAnimationId) {
        cancelAnimationFrame(confettiAnimationId);
        confettiAnimationId = null;
      }
    }

    if (champCloseBtn) {
      champCloseBtn.addEventListener('click', closeChampModal);
      champCloseBtn.addEventListener('pointerdown', closeChampModal);
    }
    if (champBackdrop) {
      champBackdrop.addEventListener('click', closeChampModal);
      champBackdrop.addEventListener('pointerdown', closeChampModal);
    }
    if (champViewBracketBtn) {
      champViewBracketBtn.addEventListener('click', closeChampModal);
      champViewBracketBtn.addEventListener('pointerdown', closeChampModal);
    }
    if (champConfettiBtn) {
      champConfettiBtn.addEventListener('click', () => {
        startConfettiAnimation();
      });
    }

    // Global modal close fallback listener
    document.addEventListener('click', (e) => {
      if (e.target && (e.target.id === 'champ-modal-close' || e.target.closest('#champ-modal-close') || e.target.id === 'champ-view-bracket-btn' || e.target.id === 'champ-modal-backdrop')) {
        closeChampModal(e);
      }
    });

    // Stage Toast Close
    const toastCloseBtn = document.getElementById('toast-close');
    if (toastCloseBtn) {
      toastCloseBtn.addEventListener('click', () => {
        const toast = document.getElementById('stage-advance-toast');
        if (toast) toast.hidden = true;
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 10. REAL DATA RENDERERS (WORLD A)
  // ---------------------------------------------------------------------------
  function renderRealStandings() {
    const config = TOURNAMENTS_CONFIG[activeTournKey];
    const isLeagueSeason = config?.format === 'leagueSeason';
    const state = tournamentState[activeTournKey];
    const realData = window.REAL_TOURNAMENTS_DATA?.[activeTournKey];
    const leagueName = realData?.name || config?.name || 'LEAGUE';

    const bannerTitle = document.getElementById('standings-banner-title');
    const tableTitle = document.getElementById('standings-table-title');
    const tableBody = document.getElementById('standings-table-body');
    const scorersTitle = document.getElementById('scorers-table-title');
    const scorersList = document.getElementById('top-scorers-list');

    // --- Back button: works for ALL league tournaments ---
    const backWrap = document.getElementById('standings-laliga-back');
    if (backWrap) {
      if (isLeagueSeason && state) {
        backWrap.hidden = false;
        const backBtn = backWrap.querySelector('#btn-standings-back-laliga');
        if (backBtn) {
          backBtn.textContent = `← BACK TO ${leagueName.toUpperCase()} HOME`;
          backBtn.onclick = () => {
            switchView('tournament-sim');
            if (state) state.subView = 'home';
            renderActiveTournament();
          };
        }
      } else {
        backWrap.hidden = true;
      }
    }

    // --- Non-league competition: show info message ---
    if (!isLeagueSeason || !state) {
      if (bannerTitle) bannerTitle.textContent = `${leagueName} — STANDINGS`;
      if (tableTitle) tableTitle.textContent = 'KNOCKOUT FORMAT';
      if (tableBody) tableBody.innerHTML = `
        <tr><td colspan="9" style="text-align:center;padding:32px 16px;color:var(--text-secondary);">
          <i class="fa-solid fa-sitemap" style="font-size:2rem;margin-bottom:12px;display:block;color:var(--accent-green);"></i>
          <strong style="color:var(--text-primary);font-size:1.1rem;">${leagueName} is a knockout competition</strong><br>
          <span style="font-size:0.85rem;">This competition does not have a league standings table.<br>Select a league format competition (Premier League, La Liga, Serie A, or Bundesliga) to view live simulation standings.</span>
        </td></tr>
      `;
      if (scorersList) scorersList.innerHTML = '';
      if (scorersTitle) scorersTitle.textContent = '';
      return;
    }

    // --- Live simulation standings ---
    const completedMatchdays = state.matchdays
      ? state.matchdays.filter(md => md.every(m => m.isSimulated)).length
      : 0;
    const totalMatchdays = state.totalMatchdays || 38;

    if (bannerTitle) bannerTitle.textContent = `${leagueName.toUpperCase()} — LIVE SIMULATION STANDINGS`;
    if (tableTitle) tableTitle.textContent = `MATCHDAY ${completedMatchdays} OF ${totalMatchdays} COMPLETED`;
    if (scorersTitle) scorersTitle.textContent = `${leagueName.toUpperCase()} — SIMULATION SCOREBOARD`;

    const rows = state.leagueTable || [];
    const totalClubs = rows.length;

    // Zone assignment (standard European rules with rich sticker icons)
    function getZone(pos, total) {
      if (pos === 1) return { label: 'CHAMPION', icon: '<i class="fa-solid fa-crown"></i>', cls: 'zone-champion' };
      if (pos <= 4) return { label: 'UEFA CHAMPIONS LEAGUE', icon: '<i class="fa-solid fa-star"></i>', cls: 'zone-ucl' };
      if (pos <= 6) return { label: 'EUROPA LEAGUE', icon: '<i class="fa-solid fa-certificate"></i>', cls: 'zone-uel' };
      if (pos === 7) return { label: 'CONFERENCE LEAGUE', icon: '<i class="fa-solid fa-shield-halved"></i>', cls: 'zone-uecl' };
      if (pos >= total - 2) return { label: 'RELEGATION', icon: '<i class="fa-solid fa-arrow-trend-down"></i>', cls: 'zone-rel' };
      return { label: '', icon: '', cls: '' };
    }

    if (tableBody) {
      if (rows.length === 0) {
        tableBody.innerHTML = `
          <tr><td colspan="9" style="text-align:center;padding:32px 16px;color:var(--text-secondary);">
            <i class="fa-solid fa-futbol fa-spin" style="font-size:2rem;margin-bottom:12px;display:block;color:var(--accent-green);"></i>
            <strong style="color:var(--text-primary);">SIMULATION NOT STARTED</strong><br>
            <span style="font-size:0.85rem;">Go to the Simulator tab and start simulating matchdays to see the live standings here.</span>
          </td></tr>
        `;
      } else {
        tableBody.innerHTML = rows.map(r => {
          const zone = getZone(r.pos, totalClubs);
          const posClass = r.pos === 1 ? 'pos-champion' : r.pos <= 4 ? 'pos-ucl' : r.pos <= 6 ? 'pos-uel' : r.pos === 7 ? 'pos-uecl' : r.pos >= totalClubs - 2 ? 'pos-rel' : '';
          return `
            <tr class="${zone.cls ? 'row-zone-' + zone.cls.replace('zone-', '') : ''}">
              <td><span class="pos-badge ${posClass}">${r.pos}</span></td>
              <td>
                <div style="display:flex;align-items:center;gap:10px;">
                  ${getTeamLogoHtml(r.club)}
                  <strong style="font-size:0.9rem;letter-spacing:0.04em;">${r.club.toUpperCase()}</strong>
                  ${r.pos === 1 && r.mp > 0 ? '<span class="leader-crown"><i class="fa-solid fa-crown"></i></span>' : ''}
                </div>
              </td>
              <td>${r.mp}</td>
              <td>${r.w}</td>
              <td>${r.d}</td>
              <td>${r.l}</td>
              <td>${r.gf}</td>
              <td>${r.ga}</td>
              <td>${r.gd > 0 ? '+' + r.gd : r.gd}</td>
              <td><strong class="${r.pos === 1 ? 'gold-text' : r.pos <= 4 ? 'ucl-text' : 'yellow-text'}">${r.pts}</strong></td>
              <td>
                ${zone.label ? `<span class="zone-badge ${zone.cls}">${zone.icon} ${zone.label}</span>` : '<span style="color:var(--text-muted);">–</span>'}
              </td>
            </tr>
          `;
        }).join('');
      }
    }

    // Show top goal scorers from simulation (built from match data)
    if (scorersList) {
      const scorerMap = {};
      (state.matchdays || []).forEach(md => {
        md.forEach(m => {
          if (!m.isSimulated) return;
          // Distribute goals to players (simulation-level: assign to clubs)
          const hScore = m.scoreHome || 0;
          const aScore = m.scoreAway || 0;
          if (!scorerMap[m.home]) scorerMap[m.home] = { club: m.home, goals: 0 };
          if (!scorerMap[m.away]) scorerMap[m.away] = { club: m.away, goals: 0 };
          scorerMap[m.home].goals += hScore;
          scorerMap[m.away].goals += aScore;
        });
      });
      const sorted = Object.values(scorerMap).sort((a, b) => b.goals - a.goals).slice(0, 8);
      if (sorted.length === 0) {
        scorersList.innerHTML = `<div style="padding:24px;text-align:center;color:var(--text-secondary);font-size:0.85rem;">No goals scored yet. Start the simulation to see stats.</div>`;
      } else {
        scorersList.innerHTML = sorted.map((s, idx) => `
          <div class="leader-item">
            <div style="display:flex;align-items:center;gap:12px;">
              ${getTeamLogoHtml(s.club)}
              <div>
                <div class="leader-name">#${idx + 1} ${s.club.toUpperCase()}</div>
                <div class="leader-team">TOTAL GOALS SCORED</div>
              </div>
            </div>
            <div class="leader-goals"><strong class="yellow-text">${s.goals}</strong> GOALS</div>
          </div>
        `).join('');
      }
    }
  }


  // ---------------------------------------------------------------------------
  // 11. MEDIA HUB & HIGHLIGHTS REPLAYS
  // ---------------------------------------------------------------------------
  let activeMediaChip = 'all';

  function renderMediaGrid() {
    const grid = document.getElementById('media-grid');
    const countBadge = document.getElementById('media-result-count');
    if (!grid) return;

    const searchVal = (document.getElementById('media-search-input')?.value || '').trim().toLowerCase();

    const filtered = HIGHLIGHTS_DATA.filter(h => {
      if (activeMediaChip !== 'all' && h.tournamentKey !== activeMediaChip) return false;
      if (searchVal && !h.title.toLowerCase().includes(searchVal) && !h.competition.toLowerCase().includes(searchVal)) return false;
      return true;
    });

    if (countBadge) countBadge.textContent = `${filtered.length} MATCHES FOUND`;

    grid.innerHTML = filtered.map(h => `
      <article class="media-card">
        <div class="thumb-wrap" data-play="${h.id}">
          <img src="${h.thumbnail}" alt="${h.title}" class="thumb-img" loading="lazy">
          <div class="play-overlay">▶</div>
          <span class="duration-tag">${h.duration}</span>
        </div>
        <div class="card-content">
          <span class="comp-badge">${h.competition.toUpperCase()} // ${h.season}</span>
          <h4 class="card-title-text">${h.title}</h4>
          <p class="card-summary">${h.summary}</p>
        </div>
      </article>
    `).join('');

    grid.querySelectorAll('.thumb-wrap').forEach(el => {
      el.addEventListener('click', () => {
        const item = HIGHLIGHTS_DATA.find(h => h.id === el.dataset.play);
        if (item) openHighlightModal(item);
      });
    });
  }

  function openHighlightModal(item) {
    const modal = document.getElementById('match-detail-modal');
    const playerBox = document.getElementById('modal-player-box');
    const title = document.getElementById('modal-match-title');
    const tag = document.getElementById('modal-match-tag');
    const info = document.getElementById('modal-match-info');
    if (!modal) return;

    if (title) title.textContent = item.title;
    if (tag) tag.textContent = `${item.competition} // ${item.season}`;
    if (playerBox) {
      playerBox.innerHTML = `<video controls autoplay class="modal-video-stream" poster="${item.thumbnail}"><source src="${item.fallbackVideo}" type="video/mp4"></video>`;
    }
    if (info) {
      info.innerHTML = `<p>${item.summary} <strong>(Final Score: ${item.score})</strong></p>`;
    }

    modal.hidden = false;
  }

  // ---------------------------------------------------------------------------
  // 10.5. LIVE 2D PITCH BROADCAST TRACKER & SOFASCORE MATCH CENTER CONTROLLER
  // ---------------------------------------------------------------------------
  let activeLivePitchInterval = null;
  let livePitchState = {
    homeTeam: '',
    awayTeam: '',
    matchObj: null,
    stageKey: null,
    matchIdx: null,
    curMin: 0,
    maxMin: 90,
    isPaused: false,
    speed: 1,
    homeFormation: '4-3-3',
    awayFormation: '4-2-3-1'
  };

  function stopLive2DPitchEngine() {
    if (activeLivePitchInterval) {
      clearInterval(activeLivePitchInterval);
      activeLivePitchInterval = null;
    }
  }

  function getFormationPositions(formation, isHome) {
    const positions = [];
    if (isHome) {
      // 4-3-3 Left Half
      positions.push({ role: 'GK', x: 7, y: 50, num: 1 });
      positions.push({ role: 'LB', x: 20, y: 18, num: 3 });
      positions.push({ role: 'CB', x: 17, y: 38, num: 4 });
      positions.push({ role: 'CB', x: 17, y: 62, num: 5 });
      positions.push({ role: 'RB', x: 20, y: 82, num: 2 });
      positions.push({ role: 'LCM', x: 31, y: 28, num: 8 });
      positions.push({ role: 'CM',  x: 29, y: 50, num: 6 });
      positions.push({ role: 'RCM', x: 31, y: 72, num: 10 });
      positions.push({ role: 'LW',  x: 43, y: 22, num: 11 });
      positions.push({ role: 'ST',  x: 45, y: 50, num: 9 });
      positions.push({ role: 'RW',  x: 43, y: 78, num: 7 });
    } else {
      // 4-2-3-1 Right Half
      positions.push({ role: 'GK', x: 93, y: 50, num: 1 });
      positions.push({ role: 'RB', x: 80, y: 18, num: 2 });
      positions.push({ role: 'CB', x: 83, y: 38, num: 4 });
      positions.push({ role: 'CB', x: 83, y: 62, num: 5 });
      positions.push({ role: 'LB', x: 80, y: 82, num: 3 });
      positions.push({ role: 'LDM', x: 71, y: 36, num: 6 });
      positions.push({ role: 'RDM', x: 71, y: 64, num: 8 });
      positions.push({ role: 'LM',  x: 59, y: 20, num: 11 });
      positions.push({ role: 'CAM', x: 57, y: 50, num: 10 });
      positions.push({ role: 'RM',  x: 59, y: 80, num: 7 });
      positions.push({ role: 'ST',  x: 53, y: 50, num: 9 });
    }
    return positions;
  }

  function initLive2DPitchEngine(homeTeam, awayTeam, matchObj = null, stageKey = null, matchIdx = null) {
    stopLive2DPitchEngine();

    const pitchPlayersContainer = document.getElementById('dstats-pitch-players');
    const pitchBall = document.getElementById('dstats-pitch-ball');
    const broadcastBanner = document.getElementById('dstats-pitch-banner');
    const bannerIcon = document.getElementById('dstats-banner-icon');
    const bannerText = document.getElementById('dstats-banner-text');
    const scrubberTime = document.getElementById('dstats-scrubber-time');
    const scrubberFill = document.getElementById('dstats-scrubber-fill');
    const scrubberThumb = document.getElementById('dstats-scrubber-thumb');
    const scrubberEvents = document.getElementById('dstats-scrubber-events');
    const tickerText = document.getElementById('dstats-pitch-ticker');
    const tacticsText = document.getElementById('dstats-tactics-text');
    const momHomeLabel = document.getElementById('dstats-mom-home-label');
    const momAwayLabel = document.getElementById('dstats-mom-away-label');
    const momHomeFill = document.getElementById('dstats-mom-home-fill');
    const momAwayFill = document.getElementById('dstats-mom-away-fill');
    const btnPlayPause = document.getElementById('dstats-btn-play-pause');
    const iconPlay = document.getElementById('dstats-icon-play');
    const txtPlay = document.getElementById('dstats-txt-play');
    const btnSkip = document.getElementById('dstats-btn-skip-match');
    const btnReplay = document.getElementById('dstats-btn-replay-event');
    const btnSpeed = document.getElementById('dstats-btn-speed');
    const btnLiveSim = document.getElementById('dstats-btn-live-sim');
    const scrubberTrack = document.getElementById('dstats-scrubber-track');

    if (!pitchPlayersContainer || !pitchBall) return;

    const homeStars = window.TEAM_STAR_PLAYERS?.[homeTeam] || ['Goalkeeper', 'Defender 1', 'Defender 2', 'Defender 3', 'Defender 4', 'Midfielder 1', 'Midfielder 2', 'Midfielder 3', 'Winger 1', 'Striker', 'Winger 2'];
    const awayStars = window.TEAM_STAR_PLAYERS?.[awayTeam] || ['Goalkeeper', 'Defender 1', 'Defender 2', 'Defender 3', 'Defender 4', 'Midfielder 1', 'Midfielder 2', 'Winger 1', 'Playmaker', 'Winger 2', 'Striker'];

    const totalMinutes = matchObj?.hadExtraTime ? 120 : 90;
    // Finished matches open paused at FT — user clicks REWATCH to replay from 0'
    const isAlreadyFinished = matchObj?.isSimulated && !matchObj?.isLive;

    livePitchState.homeTeam = homeTeam;
    livePitchState.awayTeam = awayTeam;
    livePitchState.matchObj = matchObj;
    livePitchState.stageKey = stageKey;
    livePitchState.matchIdx = matchIdx;
    livePitchState.curMin = isAlreadyFinished ? totalMinutes : (matchObj?.isLive ? (matchObj.currentSimMinute || 0) : 0);
    livePitchState.maxMin = totalMinutes;
    livePitchState.isPaused = isAlreadyFinished; // paused at FT for finished matches
    livePitchState.speed = 1;

    if (btnSpeed) btnSpeed.textContent = '1x';
    // RESUME/PAUSE icon — at FT show ▶ RESUME, during play show ⏸ PAUSE
    if (iconPlay) iconPlay.className = isAlreadyFinished ? 'fa-solid fa-play' : 'fa-solid fa-pause';
    if (txtPlay) txtPlay.textContent = isAlreadyFinished ? 'RESUME' : 'PAUSE';

    function finalizeMatch() {
      const m = livePitchState.matchObj;
      if (!m) return;
      m.isLive = false;
      m.isSimulated = true;

      // Update status pill in modal
      const statusBadge = document.getElementById('dstats-status-badge');
      if (statusBadge) {
        statusBadge.textContent = m.hadPenalties ? `FT (PENS ${m.penHome}-${m.penAway})` : (m.hadExtraTime ? 'AET' : 'FT');
        statusBadge.className = 'dstats-status-pill';
      }

      // Update score display in modal
      const homeScoreEl = document.getElementById('dstats-home-score');
      const awayScoreEl = document.getElementById('dstats-away-score');
      if (homeScoreEl) homeScoreEl.textContent = m.scoreHome;
      if (awayScoreEl) awayScoreEl.textContent = m.scoreAway;

      if (stageKey && tournamentState[activeTournKey]?.[stageKey]) {
        const allDone = (tournamentState[activeTournKey][stageKey] || []).every(match => match.isSimulated);
        if (allDone) {
          progressToNextStage(stageKey);
        }
      }
      renderActiveTournament();
    }

    // Build Formations
    const homeFormPos = getFormationPositions('4-3-3', true);
    const awayFormPos = getFormationPositions('4-2-3-1', false);

    if (tacticsText) tacticsText.textContent = `${homeTeam.substring(0, 3).toUpperCase()} 4-3-3 vs 4-2-3-1 ${awayTeam.substring(0, 3).toUpperCase()}`;

    // Render Scrubber Goal & Card Markers
    if (scrubberEvents) {
      const events = matchObj?.events || [];
      scrubberEvents.innerHTML = events.map(ev => {
        const pct = Math.min(100, Math.max(0, (ev.minute / totalMinutes) * 100));
        const icon = ev.type?.includes('GOAL') ? '⚽' : (ev.type?.includes('CARD') ? '🟨' : '⚡');
        return `<div class="dstats-event-dot" style="left: ${pct}%;" title="${ev.minute}' ${ev.teamName}: ${ev.player}">${icon}</div>`;
      }).join('');
    }

    // Create 22 Player DOM Nodes
    let playersHtml = '';
    const homeNodes = homeFormPos.map((pos, i) => {
      const name = homeStars[i] || `Home ${i+1}`;
      const isGK = pos.role === 'GK';
      return `
        <div class="dstats-player-node home ${isGK ? 'gk' : ''}" id="p-home-${i}" style="left: ${pos.x}%; top: ${pos.y}%;" data-idx="${i}" data-team="home" title="${name} (${pos.role})">
          <div class="dstats-player-jersey">${pos.num}</div>
          <div class="dstats-player-name-tag">${name.split(' ').pop()}</div>
        </div>
      `;
    });

    const awayNodes = awayFormPos.map((pos, i) => {
      const name = awayStars[i] || `Away ${i+1}`;
      const isGK = pos.role === 'GK';
      return `
        <div class="dstats-player-node away ${isGK ? 'gk' : ''}" id="p-away-${i}" style="left: ${pos.x}%; top: ${pos.y}%;" data-idx="${i}" data-team="away" title="${name} (${pos.role})">
          <div class="dstats-player-jersey">${pos.num}</div>
          <div class="dstats-player-name-tag">${name.split(' ').pop()}</div>
        </div>
      `;
    });

    pitchPlayersContainer.innerHTML = homeNodes.join('') + awayNodes.join('');

    // Update Frame Function
    function updatePitchFrame() {
      const m = livePitchState.matchObj;
      const min = Math.min(livePitchState.maxMin, Math.floor(livePitchState.curMin));
      
      if (scrubberTime) scrubberTime.textContent = `${min}'`;
      const progressPct = (min / livePitchState.maxMin) * 100;
      if (scrubberFill) scrubberFill.style.width = `${progressPct}%`;
      if (scrubberThumb) scrubberThumb.style.left = `${progressPct}%`;

      // Find if an event happened at or near this minute
      const currentEvent = m?.events?.find(e => Math.abs(e.minute - min) <= 1);
      
      let ballX = 50;
      let ballY = 50;
      let actionTitle = '';
      let actionIcon = '⚡';
      let tickerMsg = '';

      if (currentEvent) {
        const isHomeGoal = currentEvent.team === 'home';
        ballX = isHomeGoal ? 92 : 8; // near goal net
        ballY = 48 + (Math.sin(min) * 12);
        actionIcon = '⚽';
        actionTitle = `GOAL! ${currentEvent.teamName} — ${currentEvent.player} (${currentEvent.minute}')`;
        tickerMsg = `⚽ GOLAZO! ${currentEvent.player} scores for ${currentEvent.teamName}!`;
      } else if (min % 10 < 3) {
        // Attack Left / Right
        const isHomeAtt = (min % 20 < 10);
        ballX = isHomeAtt ? 72 + (min % 5) * 3 : 28 - (min % 5) * 3;
        ballY = 30 + ((min * 17) % 40);
        actionIcon = '⚡';
        actionTitle = isHomeAtt ? `${homeTeam.substring(0, 3).toUpperCase()} DANGEROUS ATTACK` : `${awayTeam.substring(0, 3).toUpperCase()} ATTACKING SURGE`;
        tickerMsg = isHomeAtt ? `⚡ ${homeTeam} pushing numbers forward down the wing!` : `⚡ ${awayTeam} carving out space through the middle!`;
      } else if (min % 10 < 6) {
        // Midfield Passing
        ballX = 42 + ((min * 13) % 18);
        ballY = 25 + ((min * 23) % 50);
        actionIcon = '🔄';
        actionTitle = 'TACTICAL MIDFIELD BUILD-UP';
        tickerMsg = `Controlling the tempo with crisp passing combinations across midfield.`;
      } else {
        // Defense / Save
        const isHomeDef = (min % 20 < 10);
        ballX = isHomeDef ? 85 : 15;
        ballY = 45 + (Math.cos(min) * 10);
        actionIcon = '🧤';
        actionTitle = 'KEY DEFENSIVE CLEARANCE';
        tickerMsg = `🧤 Crucial intervention inside the penalty box clears the danger!`;
      }

      // Position Ball
      pitchBall.style.left = `${ballX}%`;
      pitchBall.style.top = `${ballY}%`;

      // Dynamically shift players slightly toward the ball
      const allPlayerEls = pitchPlayersContainer.querySelectorAll('.dstats-player-node');
      allPlayerEls.forEach(el => {
        el.classList.remove('has-ball');
      });

      // Find closest player to ball and highlight
      let closestEl = null;
      let minDistance = 9999;
      allPlayerEls.forEach(el => {
        const isHome = el.dataset.team === 'home';
        const idx = parseInt(el.dataset.idx, 10);
        const basePos = isHome ? homeFormPos[idx] : awayFormPos[idx];
        
        // Small organic drift toward ball
        const dx = (ballX - basePos.x) * 0.28;
        const dy = (ballY - basePos.y) * 0.28;
        const finalX = Math.max(5, Math.min(95, basePos.x + dx));
        const finalY = Math.max(8, Math.min(92, basePos.y + dy));

        el.style.left = `${finalX}%`;
        el.style.top = `${finalY}%`;

        const dist = Math.hypot(ballX - finalX, ballY - finalY);
        if (dist < minDistance) {
          minDistance = dist;
          closestEl = el;
        }
      });

      if (closestEl && minDistance < 14) {
        closestEl.classList.add('has-ball');
      }

      // Update Momentum Bar
      const homeMom = Math.max(30, Math.min(70, Math.round(50 + (ballX - 50) * 0.4)));
      const awayMom = 100 - homeMom;
      if (momHomeLabel) momHomeLabel.textContent = `${homeTeam.substring(0, 3).toUpperCase()} ${homeMom}%`;
      if (momAwayLabel) momAwayLabel.textContent = `${awayMom}% ${awayTeam.substring(0, 3).toUpperCase()}`;
      if (momHomeFill) momHomeFill.style.width = `${homeMom}%`;
      if (momAwayFill) momAwayFill.style.width = `${awayMom}%`;

      // Update Action Banner
      if (broadcastBanner && bannerText && bannerIcon) {
        broadcastBanner.hidden = false;
        bannerIcon.textContent = actionIcon;
        bannerText.textContent = actionTitle;
      }

      if (tickerText) {
        tickerText.textContent = tickerMsg;
      }
    }

    // Scrubber click listener
    if (scrubberTrack) {
      scrubberTrack.onclick = (e) => {
        const rect = scrubberTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        livePitchState.curMin = pct * livePitchState.maxMin;
        updatePitchFrame();
      };
    }

    // Play/Pause button
    // RESUME / PAUSE button — toggles play/pause during ball-tracking
    if (btnPlayPause) {
      btnPlayPause.onclick = () => {
        livePitchState.isPaused = !livePitchState.isPaused;
        if (iconPlay) iconPlay.className = livePitchState.isPaused ? 'fa-solid fa-play' : 'fa-solid fa-pause';
        if (txtPlay) txtPlay.textContent = livePitchState.isPaused ? 'RESUME' : 'PAUSE';
        updatePitchFrame();
      };
    }

    // SKIP TO END — fast-forward directly to match conclusion
    if (btnSkip) {
      btnSkip.onclick = () => {
        livePitchState.curMin = livePitchState.maxMin;
        livePitchState.isPaused = true;
        finalizeMatch();
        updatePitchFrame();
        if (iconPlay) iconPlay.className = 'fa-solid fa-play';
        if (txtPlay) txtPlay.textContent = 'RESUME';
      };
    }

    // PREV EVENT — jump backward to the previous key moment (goal/chance)
    if (btnReplay) {
      btnReplay.onclick = () => {
        const m = livePitchState.matchObj;
        const events = m?.events || [];
        const prevEvent = [...events].reverse().find(e => e.minute < livePitchState.curMin - 1) || events[0];
        if (prevEvent) {
          livePitchState.curMin = Math.max(0, prevEvent.minute - 2);
        } else {
          livePitchState.curMin = 0;
        }
        livePitchState.isPaused = false;
        if (iconPlay) iconPlay.className = 'fa-solid fa-pause';
        if (txtPlay) txtPlay.textContent = 'PAUSE';
        updatePitchFrame();
      };
    }

    // Speed toggle
    if (btnSpeed) {
      btnSpeed.onclick = () => {
        livePitchState.speed = livePitchState.speed === 1 ? 2 : (livePitchState.speed === 2 ? 4 : 1);
        btnSpeed.textContent = `${livePitchState.speed}x`;
      };
    }

    // REWATCH — reset to kick-off (0') and auto-play full ball-tracking simulation
    if (btnLiveSim) {
      btnLiveSim.onclick = () => {
        livePitchState.curMin = 0;
        livePitchState.isPaused = false;
        if (iconPlay) iconPlay.className = 'fa-solid fa-pause';
        if (txtPlay) txtPlay.textContent = 'PAUSE';
        updatePitchFrame();
      };
    }

    updatePitchFrame();

    // Live 2D Pitch Animation Loop — stops at FT, no looping
    activeLivePitchInterval = setInterval(() => {
      if (livePitchState.isPaused) return;

      livePitchState.curMin += 0.8 * livePitchState.speed;
      if (livePitchState.curMin >= livePitchState.maxMin) {
        livePitchState.curMin = livePitchState.maxMin;
        livePitchState.isPaused = true;
        finalizeMatch();
        updatePitchFrame();
        // At FT, switch to RESUME state
        if (iconPlay) iconPlay.className = 'fa-solid fa-play';
        if (txtPlay) txtPlay.textContent = 'RESUME';
        return;
      }
      updatePitchFrame();
    }, 400);
  }

  function openDetailedStatsModal(homeTeam, awayTeam, matchObj = null, stageKey = null, matchIdx = null) {
    const modal = document.getElementById('detailed-stats-modal');
    if (!modal) return;

    const state = tournamentState[activeTournKey];
    const config = TOURNAMENTS_CONFIG[activeTournKey] || {};
    const compName = (config.name || 'FIFA WORLD CUP 2026').toUpperCase();
    const stageTitle = STAGE_META[stageKey]?.title || (stageKey ? stageKey.toUpperCase() : 'MATCH FIXTURE');

    // 1. Meta Line
    const venueEl = document.getElementById('dstats-venue');
    const compStageEl = document.getElementById('dstats-comp-stage');
    if (venueEl) venueEl.textContent = `📍 ${matchObj?.stadium ? `${matchObj.stadium}, ${matchObj.city}` : 'Official Match Arena'}`;
    if (compStageEl) compStageEl.textContent = `${compName} · ${stageTitle}`;

    // 2. Status Badge
    const statusBadge = document.getElementById('dstats-status-badge');
    if (statusBadge) {
      if (matchObj?.isLive) {
        statusBadge.textContent = `LIVE ${matchObj.currentSimMinute || 0}'`;
        statusBadge.className = 'dstats-status-pill live';
      } else if (matchObj?.isSimulated) {
        statusBadge.textContent = matchObj.hadPenalties ? `FT (PENS ${matchObj.penHome}-${matchObj.penAway})` : (matchObj.hadExtraTime ? 'AET' : 'FT');
        statusBadge.className = 'dstats-status-pill';
      } else {
        statusBadge.textContent = 'UPCOMING';
        statusBadge.className = 'dstats-status-pill';
      }
    }

    // 3. Team Shields & Names
    const homeLogoEl = document.getElementById('dstats-home-logo');
    const awayLogoEl = document.getElementById('dstats-away-logo');
    const homeNameEl = document.getElementById('dstats-home-name');
    const awayNameEl = document.getElementById('dstats-away-name');
    if (homeLogoEl) homeLogoEl.innerHTML = getTeamLogoHtml(homeTeam);
    if (awayLogoEl) awayLogoEl.innerHTML = getTeamLogoHtml(awayTeam);
    if (homeNameEl) homeNameEl.textContent = homeTeam;
    if (awayNameEl) awayNameEl.textContent = awayTeam;

    // 4. Scores
    const scoreDisplayEl = document.getElementById('dstats-score-display');
    const pensInfoEl = document.getElementById('dstats-pens-info');
    if (scoreDisplayEl) {
      if (matchObj?.isSimulated) {
        scoreDisplayEl.textContent = `${matchObj.scoreHome} - ${matchObj.scoreAway}`;
      } else if (matchObj?.isLive) {
        scoreDisplayEl.textContent = `${matchObj.currentDisplayScoreHome || 0} - ${matchObj.currentDisplayScoreAway || 0}`;
      } else {
        scoreDisplayEl.textContent = '0 - 0';
      }
    }
    if (pensInfoEl) {
      pensInfoEl.textContent = matchObj?.hadPenalties && matchObj?.isSimulated ? `🧤 Shootout: ${matchObj.penHome} - ${matchObj.penAway} (${matchObj.winner} won)` : '';
    }

    // Star Players
    const homeStars = window.TEAM_STAR_PLAYERS?.[homeTeam] || ['Captain', 'Midfielder', 'Striker', 'Winger', 'Defender', 'Goalkeeper'];
    const awayStars = window.TEAM_STAR_PLAYERS?.[awayTeam] || ['Captain', 'Midfielder', 'Striker', 'Winger', 'Defender', 'Goalkeeper'];

    // 5. Timeline Events
    const timelineEl = document.getElementById('dstats-timeline-list');
    if (timelineEl) {
      const curMin = matchObj?.isLive ? (matchObj.currentSimMinute || 0) : 120;
      let events = (matchObj?.events || []).filter(e => matchObj.isSimulated || (matchObj.isLive && e.minute <= curMin));
      
      let timelineItemsHtml = '';
      if (events.length > 0) {
        const sorted = [...events].sort((a, b) => b.minute - a.minute);
        timelineItemsHtml = sorted.map(ev => {
          const isHome = ev.team === 'home';
          return `
            <div class="dstats-event-item">
              <span class="dstats-ev-min">${ev.minute}'</span>
              <div class="dstats-ev-body ${isHome ? 'home-align' : 'away-align'}">
                ${isHome ? `
                  <span class="dstats-ev-icon-pill">⚽</span>
                  <span class="dstats-ev-player-main">${ev.player}</span>
                  ${ev.assist ? `<span class="dstats-ev-assist">(${ev.assist})</span>` : ''}
                ` : `
                  ${ev.assist ? `<span class="dstats-ev-assist">(${ev.assist})</span>` : ''}
                  <span class="dstats-ev-player-main">${ev.player}</span>
                  <span class="dstats-ev-icon-pill">⚽</span>
                `}
              </div>
            </div>
          `;
        }).join('');
      } else {
        timelineItemsHtml = `
          <div class="dstats-event-item" style="justify-content:center;color:#94a3b8;font-style:italic;padding:24px 0;">
            ${matchObj?.isSimulated ? 'Defensive tactical masterclass · No regular time goals' : 'Match scheduled to kickoff'}
          </div>
        `;
      }
      timelineEl.innerHTML = timelineItemsHtml;
    }

    // 6. Top Performers (Green Pitch Box)
    const performersBox = document.getElementById('dstats-performers-box');
    if (performersBox) {
      const p1 = homeStars[homeStars.length - 1] || 'Goalkeeper';
      const p2 = (matchObj?.events?.[0]?.player) || homeStars[0] || 'Star Striker';
      const p3 = awayStars[0] || 'Key Playmaker';

      performersBox.innerHTML = `
        <div class="dstats-player-performer">
          <div class="dstats-performer-jersey-wrap">
            <span class="dstats-perf-rating-pill">7.1</span>
            👕
          </div>
          <span class="dstats-perf-name">${p1}</span>
          <span class="dstats-perf-role">GK | ${homeTeam.substring(0, 3).toUpperCase()}</span>
        </div>

        <div class="dstats-player-performer star-performer">
          <div class="dstats-performer-jersey-wrap">
            <span class="dstats-perf-rating-pill">⭐ 7.4</span>
            <span class="dstats-perf-goal-ball">⚽</span>
            🎽
          </div>
          <span class="dstats-perf-name">${p2}</span>
          <span class="dstats-perf-role">FW | ${homeTeam.substring(0, 3).toUpperCase()}</span>
        </div>

        <div class="dstats-player-performer">
          <div class="dstats-performer-jersey-wrap">
            <span class="dstats-perf-rating-pill">7.1</span>
            <span class="dstats-perf-goal-ball">⚽</span>
            👕
          </div>
          <span class="dstats-perf-name">${p3}</span>
          <span class="dstats-perf-role">MF | ${awayTeam.substring(0, 3).toUpperCase()}</span>
        </div>
      `;
    }

    // 7. Chance Distribution
    const chanceBox = document.getElementById('dstats-chance-box');
    if (chanceBox) {
      const homeStr = (window.NATIONS_DATA || []).find(n => n.name === homeTeam)?.str || 78;
      const awayStr = (window.NATIONS_DATA || []).find(n => n.name === awayTeam)?.str || 75;
      const total = homeStr + awayStr + 32;
      const homePct = Math.round((homeStr / total) * 100);
      const drawPct = Math.round((32 / total) * 100);
      const awayPct = 100 - homePct - drawPct;

      chanceBox.innerHTML = `
        <div>
          <div class="dstats-chance-metric-row">
            <span class="dstats-chance-team-tag">${getTeamLogoHtml(homeTeam)} ${homeTeam.substring(0, 3).toUpperCase()}</span>
            <span>${homePct}%</span>
          </div>
          <div class="dstats-chance-bar-track">
            <div class="dstats-chance-bar-fill" style="width: ${homePct}%; background: #2563eb;"></div>
          </div>
        </div>

        <div>
          <div class="dstats-chance-metric-row">
            <span class="dstats-chance-team-tag">⚖️ Draw</span>
            <span>${drawPct}%</span>
          </div>
          <div class="dstats-chance-bar-track">
            <div class="dstats-chance-bar-fill" style="width: ${drawPct}%; background: #64748b;"></div>
          </div>
        </div>

        <div>
          <div class="dstats-chance-metric-row">
            <span class="dstats-chance-team-tag">${getTeamLogoHtml(awayTeam)} ${awayTeam.substring(0, 3).toUpperCase()}</span>
            <span>${awayPct}%</span>
          </div>
          <div class="dstats-chance-bar-track">
            <div class="dstats-chance-bar-fill" style="width: ${awayPct}%; background: #dc2626;"></div>
          </div>
        </div>
      `;
    }

    // 8. Stats Comparison Container
    const statsContainer = document.getElementById('dstats-stats-container');
    if (statsContainer) {
      const homePoss = 52 + ((homeTeam.charCodeAt(0) % 15) - 7);
      const awayPoss = 100 - homePoss;
      const hShots = (matchObj?.scoreHome || 0) * 3 + 6;
      const aShots = (matchObj?.scoreAway || 0) * 3 + 5;
      const hxG = ((matchObj?.scoreHome || 0) * 0.72 + 0.54).toFixed(2);
      const axG = ((matchObj?.scoreAway || 0) * 0.68 + 0.42).toFixed(2);

      const statMetrics = [
        { lbl: 'Ball Possession', h: `${homePoss}%`, a: `${awayPoss}%`, hp: homePoss },
        { lbl: 'Expected Goals (xG)', h: hxG, a: axG, hp: Math.round((parseFloat(hxG)/(parseFloat(hxG)+parseFloat(axG)+0.01))*100) },
        { lbl: 'Total Shots', h: hShots, a: aShots, hp: Math.round((hShots/(hShots+aShots))*100) },
        { lbl: 'Shots on Target', h: Math.round(hShots * 0.45), a: Math.round(aShots * 0.4), hp: 50 },
        { lbl: 'Corner Kicks', h: 6, a: 4, hp: 60 },
        { lbl: 'Fouls Committed', h: 11, a: 13, hp: 45 },
        { lbl: 'Yellow Cards', h: 1, a: 2, hp: 33 },
        { lbl: 'Pass Accuracy', h: '88%', a: '84%', hp: 52 }
      ];

      statsContainer.innerHTML = statMetrics.map(sm => `
        <div class="dstats-stat-compare-row">
          <div class="dstats-stat-nums-line">
            <span>${sm.h}</span>
            <span class="dstats-stat-center-lbl">${sm.lbl}</span>
            <span>${sm.a}</span>
          </div>
          <div class="dstats-stat-dual-bar">
            <div class="dstats-stat-left-bar" style="width: ${sm.hp}%"></div>
            <div class="dstats-stat-right-bar" style="width: ${100 - sm.hp}%"></div>
          </div>
        </div>
      `).join('');
    }

    // 9. Lineups Container
    const lineupsContainer = document.getElementById('dstats-lineups-container');
    if (lineupsContainer) {
      lineupsContainer.innerHTML = `
        <div class="dstats-lineup-squad-box">
          <div class="dstats-lineup-header">
            <span>${homeTeam} (4-3-3)</span>
            <span>STARTING XI</span>
          </div>
          <div class="dstats-lineup-roster-list">
            ${homeStars.slice(0, 11).map((p, i) => `
              <div class="dstats-lineup-player-row">
                <span class="dstats-roster-num">${i + 1}</span>
                <span class="dstats-roster-pname">${p}</span>
                <span class="dstats-roster-pos">${i === 0 ? 'GK' : (i < 5 ? 'DEF' : (i < 8 ? 'MID' : 'FWD'))}</span>
                <span class="dstats-roster-rating">${(7.0 + ((p.charCodeAt(0) % 15) / 10)).toFixed(1)}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="dstats-lineup-squad-box">
          <div class="dstats-lineup-header">
            <span>${awayTeam} (4-2-3-1)</span>
            <span>STARTING XI</span>
          </div>
          <div class="dstats-lineup-roster-list">
            ${awayStars.slice(0, 11).map((p, i) => `
              <div class="dstats-lineup-player-row">
                <span class="dstats-roster-num">${i + 1}</span>
                <span class="dstats-roster-pname">${p}</span>
                <span class="dstats-roster-pos">${i === 0 ? 'GK' : (i < 5 ? 'DEF' : (i < 8 ? 'MID' : 'FWD'))}</span>
                <span class="dstats-roster-rating">${(6.9 + ((p.charCodeAt(0) % 14) / 10)).toFixed(1)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    // 10. Feed Commentary List
    const feedList = document.getElementById('dstats-feed-list');
    if (feedList) {
      feedList.innerHTML = `
        <div class="dstats-feed-entry">
          <span class="dstats-feed-min-badge">90'</span>
          <div class="dstats-feed-text">Referee blows the final whistle! High intensity tactical encounter concludes.</div>
        </div>
        <div class="dstats-feed-entry">
          <span class="dstats-feed-min-badge">78'</span>
          <div class="dstats-feed-text">Dangerous counter-attack creates a golden scoring opportunity!</div>
        </div>
        <div class="dstats-feed-entry">
          <span class="dstats-feed-min-badge">45'</span>
          <div class="dstats-feed-text">Half-time whistle. Teams head to the dressing room after an intense midfield battle.</div>
        </div>
        <div class="dstats-feed-entry">
          <span class="dstats-feed-min-badge">1'</span>
          <div class="dstats-feed-text">Kick-off! The match gets underway in front of an electric crowd.</div>
        </div>
      `;
    }

    // 11. Info Tab
    const infoContainer = document.getElementById('dstats-info-container');
    if (infoContainer) {
      infoContainer.innerHTML = `
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Competition</span>
          <span class="dstats-info-val">${compName}</span>
        </div>
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Stage / Round</span>
          <span class="dstats-info-val">${stageTitle}</span>
        </div>
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Stadium Venue</span>
          <span class="dstats-info-val">${matchObj?.stadium || 'MetLife Stadium, New Jersey'}</span>
        </div>
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Capacity</span>
          <span class="dstats-info-val">82,500 Spectators</span>
        </div>
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Referee</span>
          <span class="dstats-info-val">Szymon Marciniak (POL)</span>
        </div>
        <div class="dstats-info-item">
          <span class="dstats-info-lbl">Simulation Engine</span>
          <span class="dstats-info-val">Poisson xG Tactical Radar v2.0</span>
        </div>
      `;
    }

    // Set default active tab: livepitch (Live 2D Pitch)
    document.querySelectorAll('.dstats-tab-pill').forEach(p => p.classList.remove('active'));
    const defPill = document.querySelector('.dstats-tab-pill[data-tab="livepitch"]');
    if (defPill) defPill.classList.add('active');
    document.querySelectorAll('.dstats-panel').forEach(p => p.classList.remove('active'));
    const defPanel = document.getElementById('dstats-panel-livepitch');
    if (defPanel) defPanel.classList.add('active');

    // Launch Live 2D Pitch Engine
    initLive2DPitchEngine(homeTeam, awayTeam, matchObj, stageKey, matchIdx);

    // View Lineups link click
    const viewLineupsLink = document.getElementById('dstats-link-lineups');
    if (viewLineupsLink) {
      viewLineupsLink.onclick = () => {
        document.querySelectorAll('.dstats-tab-pill').forEach(p => p.classList.remove('active'));
        const luPill = document.querySelector('.dstats-tab-pill[data-tab="lineups"]');
        if (luPill) luPill.classList.add('active');
        document.querySelectorAll('.dstats-panel').forEach(p => p.classList.remove('active'));
        const luPanel = document.getElementById('dstats-panel-lineups');
        if (luPanel) luPanel.classList.add('active');
      };
    }

    // Action button listeners
    const restartBtn = document.getElementById('dstats-btn-restart');
    if (restartBtn) {
      restartBtn.onclick = () => {
        if (stageKey && matchIdx !== undefined && state?.[stageKey]?.[matchIdx]) {
          state[stageKey][matchIdx].isSimulated = false;
          state[stageKey][matchIdx].isLive = false;
          state[stageKey][matchIdx].scoreHome = 0;
          state[stageKey][matchIdx].scoreAway = 0;
          state[stageKey][matchIdx].events = [];
          renderActiveTournament();
          openDetailedStatsModal(homeTeam, awayTeam, state[stageKey][matchIdx], stageKey, matchIdx);
        }
      };
    }

    const rematchBtn = document.getElementById('dstats-btn-rematch');
    if (rematchBtn) {
      rematchBtn.onclick = () => {
        modal.hidden = true;
        stopLive2DPitchEngine();
        if (stageKey && matchIdx !== undefined) {
          simulateSingleMatch(stageKey, matchIdx);
        }
      };
    }

    const saveBtn = document.getElementById('dstats-btn-save');
    if (saveBtn) {
      saveBtn.onclick = () => {
        saveBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Saved!</span>';
        setTimeout(() => {
          saveBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i> <span>Save</span>';
        }, 1500);
      };
    }

    const shareBtn = document.getElementById('dstats-btn-share');
    if (shareBtn) {
      shareBtn.onclick = () => {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(`${homeTeam} vs ${awayTeam} — ${compName}`);
          shareBtn.innerHTML = '<i class="fa-solid fa-check"></i> <span>Copied!</span>';
          setTimeout(() => {
            shareBtn.innerHTML = '<i class="fa-solid fa-share-nodes"></i> <span>Share</span>';
          }, 1500);
        }
      };
    }

    modal.hidden = false;
  }

  window.openDetailedStatsModal = openDetailedStatsModal;


  // ---------------------------------------------------------------------------
  // 11. 3D HOLOGRAPHIC STADIUM BROADCAST STUDIO CONTROLLER
  // ---------------------------------------------------------------------------
  let activeHoloInterval = null;
  let holoSpeed = 1;
  let holoPaused = false;

  function open3DHolographicBroadcast(homeTeam, awayTeam, matchObj = null, stageKey = null, matchIdx = null) {
    const modal = document.getElementById('broadcast-hologram-modal');
    if (!modal) return;

    if (activeHoloInterval) {
      clearInterval(activeHoloInterval);
      activeHoloInterval = null;
    }
    holoSpeed = 1;
    holoPaused = false;

    // Elements
    const tournTag = document.getElementById('holo-tourn-tag');
    const homeLogo = document.getElementById('holo-home-logo');
    const homeName = document.getElementById('holo-home-name');
    const awayLogo = document.getElementById('holo-away-logo');
    const awayName = document.getElementById('holo-away-name');
    const homeScoreEl = document.getElementById('holo-home-score');
    const awayScoreEl = document.getElementById('holo-away-score');
    const clockBadge = document.getElementById('holo-clock-badge');
    const statusText = document.getElementById('holo-status-text');
    const eventsTicker = document.getElementById('holo-events-ticker');
    const ballTrack = document.getElementById('holo-ball-track');
    const ballSphere = document.getElementById('holo-3d-ball');
    const actionBubble = document.getElementById('holo-action-bubble');
    const pauseBtn = document.getElementById('holo-btn-pause');
    const speedBtn = document.getElementById('holo-btn-speed');
    const skipBtn = document.getElementById('holo-btn-skip');

    if (tournTag) tournTag.textContent = (TOURNAMENTS_CONFIG[activeTournKey]?.name || 'FIFA WORLD CUP 2026').toUpperCase();
    if (homeLogo) homeLogo.innerHTML = getTeamLogoHtml(homeTeam);
    if (homeName) homeName.textContent = homeTeam.toUpperCase();
    if (awayLogo) awayLogo.innerHTML = getTeamLogoHtml(awayTeam);
    if (awayName) awayName.textContent = awayTeam.toUpperCase();
    if (eventsTicker) eventsTicker.innerHTML = '';
    if (pauseBtn) pauseBtn.textContent = '⏸ PAUSE';
    if (speedBtn) speedBtn.textContent = '⚡ 1x SPEED';

    modal.hidden = false;

    if (!matchObj) {
      matchObj = { home: homeTeam, away: awayTeam, isSimulated: false };
    }

    // Ensure outcome is precomputed
    if (!matchObj.winner && !matchObj.isSimulated) {
      const outcome = precomputeMatchResult(homeTeam, awayTeam, true);
      Object.assign(matchObj, outcome);
    }

    let curMin = 0;
    const maxMin = matchObj.hadExtraTime ? 120 : 90;
    const events = matchObj.events || [];

    function updateHoloFrame() {
      const homeCount = events.filter(e => e.team === 'home' && e.minute <= curMin).length;
      const awayCount = events.filter(e => e.team === 'away' && e.minute <= curMin).length;

      if (homeScoreEl) homeScoreEl.textContent = matchObj.isSimulated ? matchObj.scoreHome : homeCount;
      if (awayScoreEl) awayScoreEl.textContent = matchObj.isSimulated ? matchObj.scoreAway : awayCount;

      let phase = curMin < 45 ? 'FIRST HALF' : curMin < 90 ? 'SECOND HALF' : 'EXTRA TIME';
      if (curMin >= maxMin) phase = matchObj.hadPenalties ? `PENS (${matchObj.penHome}-${matchObj.penAway})` : 'FULL TIME';
      if (clockBadge) clockBadge.textContent = `⏱ ${Math.min(maxMin, curMin)}' (${phase})`;

      // 3D Ball physics and trajectories in holographic stage
      const goal = events.find(e => Math.abs(e.minute - curMin) <= 5);
      let posX = 50;
      let posY = 50;
      let posZ = 12;
      let bubbleText = 'POSSESSION ⚽';
      let statusStr = 'Midfield battle • Dynamic 3D ball tracking active';

      if (goal) {
        if (goal.team === 'home') {
          posX = 86; posY = 46; posZ = 42;
          bubbleText = `⚽ GOLAZO! ${goal.player} ${goal.minute}'`;
          statusStr = `⚡ GOAL! ${homeTeam} scores! Spectacular strike by ${goal.player}!`;
        } else {
          posX = 14; posY = 46; posZ = 42;
          bubbleText = `⚽ GOLAZO! ${goal.player} ${goal.minute}'`;
          statusStr = `⚡ GOAL! ${awayTeam} scores! Masterclass finish by ${goal.player}!`;
        }
        if (ballSphere) ballSphere.classList.add('goal-strike');

        if (eventsTicker && !eventsTicker.querySelector(`[data-min="${goal.minute}"]`)) {
          const chip = document.createElement('div');
          chip.className = 'holo-event-chip';
          chip.dataset.min = goal.minute;
          chip.textContent = `⚽ ${goal.minute}' ${goal.teamName}: ${goal.player}`;
          eventsTicker.appendChild(chip);
        }
      } else {
        if (ballSphere) ballSphere.classList.remove('goal-strike');
        if (curMin < 10) {
          posX = 50 + Math.sin(curMin) * 8;
          posY = 50 + Math.cos(curMin) * 6;
          posZ = 10;
          bubbleText = 'KICKOFF ⚽';
          statusStr = 'Kickoff • Opening minutes tactical feeling-out';
        } else if (curMin % 20 < 10) {
          posX = 65 + Math.sin(curMin * 0.8) * 16;
          posY = 42 + Math.cos(curMin * 0.6) * 18;
          posZ = 18;
          bubbleText = `ATTACK 🔥 · ${homeTeam}`;
          statusStr = `${homeTeam} pressing high into the attacking final third`;
        } else {
          posX = 35 - Math.sin(curMin * 0.8) * 16;
          posY = 42 + Math.sin(curMin * 0.6) * 18;
          posZ = 18;
          bubbleText = `COUNTER ⚡ · ${awayTeam}`;
          statusStr = `${awayTeam} surging forward with rapid counter-attacking pace`;
        }
      }

      if (ballTrack) {
        ballTrack.style.left = `${posX}%`;
        ballTrack.style.top = `${posY}%`;
        ballTrack.style.transform = `translate3d(0, 0, ${posZ}px)`;
      }
      if (actionBubble) actionBubble.textContent = bubbleText;
      if (statusText) statusText.textContent = statusStr;
    }

    updateHoloFrame();

    activeHoloInterval = setInterval(() => {
      if (holoPaused) return;
      curMin += 4 * holoSpeed;
      updateHoloFrame();

      if (curMin >= maxMin) {
        clearInterval(activeHoloInterval);
        activeHoloInterval = null;
        if (matchObj) {
          matchObj.isLive = false;
          matchObj.isSimulated = true;
        }
        if (stageKey && tournamentState[activeTournKey]?.[stageKey]) {
          const allDone = (tournamentState[activeTournKey][stageKey] || []).every(m => m.isSimulated);
          if (allDone) {
            progressToNextStage(stageKey);
          }
        }
        renderActiveTournament();
        if (stageKey) showStageAdvancementToast(stageKey);
      }
    }, 150);

    if (pauseBtn) {
      pauseBtn.onclick = () => {
        holoPaused = !holoPaused;
        pauseBtn.textContent = holoPaused ? '▶ RESUME' : '⏸ PAUSE';
      };
    }
    if (speedBtn) {
      speedBtn.onclick = () => {
        holoSpeed = holoSpeed === 1 ? 2 : (holoSpeed === 2 ? 4 : 1);
        speedBtn.textContent = `⚡ ${holoSpeed}x SPEED`;
      };
    }
    if (skipBtn) {
      skipBtn.onclick = () => {
        curMin = maxMin;
        updateHoloFrame();
        if (activeHoloInterval) {
          clearInterval(activeHoloInterval);
          activeHoloInterval = null;
        }
        if (matchObj) {
          matchObj.isLive = false;
          matchObj.isSimulated = true;
        }
        if (stageKey && tournamentState[activeTournKey]?.[stageKey]) {
          const allDone = (tournamentState[activeTournKey][stageKey] || []).every(m => m.isSimulated);
          if (allDone) {
            progressToNextStage(stageKey);
          }
        }
        renderActiveTournament();
        if (stageKey) showStageAdvancementToast(stageKey);
      };
    }
  }

  // ---------------------------------------------------------------------------
  // 12. KINEXON PRO TACTICAL MATCH TRACKER CONTROLLER (REFERENCE THEME)
  // ---------------------------------------------------------------------------
  let activeTacInterval = null;
  let tacSpeed = 1;
  let tacPaused = false;

  function getTacticalRoster(teamName) {
    const stars = (window.TEAM_STAR_PLAYERS && window.TEAM_STAR_PLAYERS[teamName]) || [];
    return {
      gk: [stars[0] || '1 Keeper'],
      def: [stars[1] || '4 Defender A', stars[2] || '6 Defender B', stars[3] || '12 Defender C', stars[4] || '13 Defender D'],
      mid: [stars[5] || '3 Midfielder A', stars[6] || '5 Midfielder B', stars[7] || '7 Midfielder C', stars[8] || '12 Midfielder D'],
      fwd: [stars[9] || '9 Striker A', stars[10] || '16 Striker B']
    };
  }

  function openProTacticalTracker(homeTeam, awayTeam, matchObj = null, stageKey = null, matchIdx = null) {
    const modal = document.getElementById('tactical-tracker-modal');
    if (!modal) return;

    if (activeTacInterval) {
      clearInterval(activeTacInterval);
      activeTacInterval = null;
    }
    tacSpeed = 1;
    tacPaused = false;

    // Elements
    const t1Name = document.getElementById('tac-team1-name');
    const t2Name = document.getElementById('tac-team2-name');
    const hudT1 = document.getElementById('tac-hud-t1');
    const hudT2 = document.getElementById('tac-hud-t2');
    const hudScore = document.getElementById('tac-hud-score');
    const hudClock = document.getElementById('tac-hud-clock');
    const hudAction = document.getElementById('tac-hud-action');
    const ballStatus = document.getElementById('tac-ball-status-text');
    const goalBanner = document.getElementById('tac-goal-banner');
    const goalText = document.getElementById('tac-goal-text');
    const phaseTag = document.getElementById('tac-phase-tag');
    const pauseBtn = document.getElementById('tac-btn-pause');
    const speedBtn = document.getElementById('tac-btn-speed');
    const skipBtn = document.getElementById('tac-btn-skip');
    const nodesLayer = document.getElementById('tac-nodes-layer');
    const meshGroup = document.getElementById('tac-mesh-group');
    const ballNode = document.getElementById('tac-ball-node');

    if (t1Name) t1Name.textContent = homeTeam.toUpperCase();
    if (t2Name) t2Name.textContent = awayTeam.toUpperCase();
    if (hudT1) hudT1.textContent = homeTeam.toUpperCase();
    if (hudT2) hudT2.textContent = awayTeam.toUpperCase();
    if (pauseBtn) pauseBtn.textContent = '⏸ PAUSE';
    if (speedBtn) speedBtn.textContent = '⚡ 1x SPEED';
    if (goalBanner) goalBanner.hidden = true;

    // Inject Rosters into sidebars
    const r1 = getTacticalRoster(homeTeam);
    const r2 = getTacticalRoster(awayTeam);

    function renderRosterSection(elId, players) {
      const el = document.getElementById(elId);
      if (!el) return;
      el.innerHTML = players.map(p => {
        const parts = p.split(' ');
        const num = parts[0].replace(/\D/g, '') || '7';
        const name = parts.slice(1).join(' ') || p;
        return `
          <div class="tac-player-row">
            <span class="tac-player-num">${num}</span>
            <span class="tac-player-name">${name}</span>
          </div>
        `;
      }).join('');
    }

    renderRosterSection('tac-t1-gk', r1.gk);
    renderRosterSection('tac-t1-def', r1.def);
    renderRosterSection('tac-t1-mid', r1.mid);
    renderRosterSection('tac-t1-fwd', r1.fwd);

    renderRosterSection('tac-t2-gk', r2.gk);
    renderRosterSection('tac-t2-def', r2.def);
    renderRosterSection('tac-t2-mid', r2.mid);
    renderRosterSection('tac-t2-fwd', r2.fwd);

    modal.hidden = false;

    if (!matchObj) {
      matchObj = { home: homeTeam, away: awayTeam, isSimulated: false };
    }

    // Precompute outcome if needed
    if (!matchObj.winner && !matchObj.isSimulated) {
      const outcome = precomputeMatchResult(homeTeam, awayTeam, true);
      Object.assign(matchObj, outcome);
    }

    let curMin = 0;
    const maxMin = matchObj.hadExtraTime ? 120 : 90;
    const events = matchObj.events || [];

    // Define 22 Player Base Tactical Coordinates (Percentages 0..100)
    const t1BaseCoords = [
      { num: 1, x: 8, y: 50 },  // GK
      { num: 4, x: 22, y: 35 }, // CB
      { num: 6, x: 22, y: 65 }, // CB
      { num: 12, x: 26, y: 18 },// LB
      { num: 13, x: 26, y: 82 },// RB
      { num: 5, x: 38, y: 50 }, // CDM
      { num: 3, x: 46, y: 30 }, // CM
      { num: 7, x: 46, y: 70 }, // CM
      { num: 12, x: 55, y: 50 },// CAM
      { num: 9, x: 68, y: 40 }, // ST
      { num: 16, x: 68, y: 60 } // ST
    ];

    const t2BaseCoords = [
      { num: 1, x: 92, y: 50 }, // GK
      { num: 4, x: 78, y: 35 }, // CB
      { num: 6, x: 78, y: 65 }, // CB
      { num: 12, x: 74, y: 18 },// LB
      { num: 13, x: 74, y: 82 },// RB
      { num: 5, x: 62, y: 50 }, // CDM
      { num: 3, x: 54, y: 30 }, // CM
      { num: 7, x: 54, y: 70 }, // CM
      { num: 12, x: 45, y: 50 },// CAM
      { num: 9, x: 32, y: 40 }, // ST
      { num: 16, x: 32, y: 60 } // ST
    ];

    function updateTacFrame() {
      const homeCount = events.filter(e => e.team === 'home' && e.minute <= curMin).length;
      const awayCount = events.filter(e => e.team === 'away' && e.minute <= curMin).length;

      if (hudScore) hudScore.textContent = `${matchObj.isSimulated ? matchObj.scoreHome : homeCount} - ${matchObj.isSimulated ? matchObj.scoreAway : awayCount}`;
      if (hudClock) hudClock.textContent = `⏱ ${Math.min(maxMin, curMin)}'`;

      if (phaseTag) {
        phaseTag.textContent = curMin < 45 ? 'Phase 1 (First Half)' : curMin < 90 ? 'Phase 2 (Second Half)' : 'Phase 3 (Extra Time)';
      }

      // Check for goal event near this minute
      const goal = events.find(e => Math.abs(e.minute - curMin) <= 4);
      let ballX = 50;
      let ballY = 50;
      let ballSpeed = 70 + Math.round(Math.sin(curMin) * 25);
      let actionText = 'Midfield tactical duel • Zonal shape compactness synchronized';

      const shiftX = Math.sin(curMin * 0.25) * 8;
      const shiftY = Math.cos(curMin * 0.25) * 6;

      const t1Current = t1BaseCoords.map((p, i) => {
        let px = p.x + (i > 0 ? shiftX : 0);
        let py = p.y + (i > 0 ? shiftY * 0.5 : 0);
        return { ...p, x: px, y: py };
      });

      const t2Current = t2BaseCoords.map((p, i) => {
        let px = p.x + (i > 0 ? shiftX : 0);
        let py = p.y + (i > 0 ? -shiftY * 0.5 : 0);
        return { ...p, x: px, y: py };
      });

      // Render 22 Player Nodes
      if (nodesLayer) {
        let nodesHtml = '';
        t1Current.forEach((p) => {
          nodesHtml += `<div class="tac-node team-1-node" style="left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%;">${p.num}</div>`;
        });
        t2Current.forEach((p) => {
          nodesHtml += `<div class="tac-node team-2-node" style="left:${p.x.toFixed(1)}%;top:${p.y.toFixed(1)}%;">${p.num}</div>`;
        });
        nodesLayer.innerHTML = nodesHtml;
      }

      // Render Tactical Mesh Polygons & Distances (Reference Image Style)
      if (meshGroup) {
        const polyPoints = [
          `${t1Current[1].x * 8},${t1Current[1].y * 5.2}`,
          `${t1Current[3].x * 8},${t1Current[3].y * 5.2}`,
          `${t1Current[6].x * 8},${t1Current[6].y * 5.2}`,
          `${t1Current[8].x * 8},${t1Current[8].y * 5.2}`,
          `${t1Current[7].x * 8},${t1Current[7].y * 5.2}`,
          `${t1Current[2].x * 8},${t1Current[2].y * 5.2}`
        ].join(' ');

        meshGroup.innerHTML = `
          <polygon points="${polyPoints}" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.4)" stroke-width="1.5" stroke-dasharray="3,3" />
          <text x="${(t1Current[6].x * 8 + t1Current[8].x * 8) / 2}" y="${(t1Current[6].y * 5.2 + t1Current[8].y * 5.2) / 2}" class="tac-dist-label">14 m</text>
          <text x="${(t1Current[3].x * 8 + t1Current[6].x * 8) / 2}" y="${(t1Current[3].y * 5.2 + t1Current[6].y * 5.2) / 2}" class="tac-dist-label">21 m</text>
          <text x="${(t1Current[8].x * 8 + t1Current[7].x * 8) / 2}" y="${(t1Current[8].y * 5.2 + t1Current[7].y * 5.2) / 2}" class="tac-dist-label">15 m</text>
          <text x="${(t1Current[7].x * 8 + t1Current[2].x * 8) / 2}" y="${(t1Current[7].y * 5.2 + t1Current[2].y * 5.2) / 2}" class="tac-dist-label">22 m</text>
        `;
      }

      // Ball Trajectory & Goals
      if (goal) {
        if (goal.team === 'home') {
          ballX = 94; ballY = 48;
          actionText = `⚡ GOAL! ${homeTeam} scores! Powerful strike by ${goal.player} (${goal.minute}')`;
        } else {
          ballX = 6; ballY = 48;
          actionText = `⚡ GOAL! ${awayTeam} scores! Spectacular finish by ${goal.player} (${goal.minute}')`;
        }
        ballSpeed = 104;
        if (goalBanner) {
          goalBanner.hidden = false;
          if (goalText) goalText.textContent = `GOAL! ${goal.player} ${goal.minute}' (${goal.teamName})`;
        }
      } else {
        if (goalBanner) goalBanner.hidden = true;
        if (curMin < 10) {
          ballX = 50 + Math.sin(curMin * 1.2) * 8;
          ballY = 50 + Math.cos(curMin * 1.2) * 10;
          actionText = `Opening exchanges • Both sides testing defensive compactness`;
        } else if (curMin % 20 < 10) {
          const targetNode = t1Current[8];
          ballX = targetNode.x + Math.sin(curMin * 1.5) * 6;
          ballY = targetNode.y + Math.cos(curMin * 1.5) * 6;
          actionText = `${homeTeam} building up through central channels with high pressing`;
        } else {
          const targetNode = t2Current[8];
          ballX = targetNode.x - Math.sin(curMin * 1.5) * 6;
          ballY = targetNode.y + Math.cos(curMin * 1.5) * 6;
          actionText = `${awayTeam} executing rapid counter-attack transition`;
        }
      }

      if (ballNode) {
        ballNode.style.left = `${ballX.toFixed(1)}%`;
        ballNode.style.top = `${ballY.toFixed(1)}%`;
      }

      if (ballStatus) {
        ballStatus.textContent = `Ball (${goal ? 'Goal Strike ' : 'In Play '} · ${ballSpeed} km/h)`;
      }

      if (hudAction) hudAction.textContent = `📍 ${actionText}`;
    }

    updateTacFrame();

    activeTacInterval = setInterval(() => {
      if (tacPaused) return;
      curMin += 4 * tacSpeed;
      updateTacFrame();

      if (curMin >= maxMin) {
        clearInterval(activeTacInterval);
        activeTacInterval = null;
        if (matchObj) {
          matchObj.isLive = false;
          matchObj.isSimulated = true;
        }
        if (stageKey && tournamentState[activeTournKey]?.[stageKey]) {
          const allDone = (tournamentState[activeTournKey][stageKey] || []).every(m => m.isSimulated);
          if (allDone) {
            progressToNextStage(stageKey);
          }
        }
        renderActiveTournament();
        if (stageKey) showStageAdvancementToast(stageKey);
      }
    }, 150);

    if (pauseBtn) {
      pauseBtn.onclick = () => {
        tacPaused = !tacPaused;
        pauseBtn.textContent = tacPaused ? '▶ RESUME' : '⏸ PAUSE';
      };
    }
    if (speedBtn) {
      speedBtn.onclick = () => {
        tacSpeed = tacSpeed === 1 ? 2 : (tacSpeed === 2 ? 4 : 1);
        speedBtn.textContent = `⚡ ${tacSpeed}x SPEED`;
      };
    }
    if (skipBtn) {
      skipBtn.onclick = () => {
        curMin = maxMin;
        updateTacFrame();
        if (activeTacInterval) {
          clearInterval(activeTacInterval);
          activeTacInterval = null;
        }
        if (matchObj) {
          matchObj.isLive = false;
          matchObj.isSimulated = true;
        }
        if (stageKey && tournamentState[activeTournKey]?.[stageKey]) {
          const allDone = (tournamentState[activeTournKey][stageKey] || []).every(m => m.isSimulated);
          if (allDone) {
            progressToNextStage(stageKey);
          }
        }
        renderActiveTournament();
        if (stageKey) showStageAdvancementToast(stageKey);
      };
    }
  }

  function setupModalHandlers() {
    const closeBtn = document.getElementById('modal-close');
    const backdrop = document.getElementById('modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', () => { document.getElementById('match-detail-modal').hidden = true; });
    if (backdrop) backdrop.addEventListener('click', () => { document.getElementById('match-detail-modal').hidden = true; });

    // 3D Holographic Broadcast Modal Close Handlers
    const holoCloseBtn = document.getElementById('holo-modal-close');
    const holoBackdrop = document.getElementById('holo-modal-backdrop');
    function closeHoloModal() {
      const holoModal = document.getElementById('broadcast-hologram-modal');
      if (holoModal) holoModal.hidden = true;
      if (activeHoloInterval) {
        clearInterval(activeHoloInterval);
        activeHoloInterval = null;
      }
    }
    if (holoCloseBtn) holoCloseBtn.addEventListener('click', closeHoloModal);
    if (holoBackdrop) holoBackdrop.addEventListener('click', closeHoloModal);

    // KINEXON Pro Tactical Tracker Close Handlers
    const tacCloseBtn = document.getElementById('tac-modal-close');
    const tacBackdrop = document.getElementById('tac-modal-backdrop');
    function closeTacModal() {
      const tacModal = document.getElementById('tactical-tracker-modal');
      if (tacModal) tacModal.hidden = true;
      if (activeTacInterval) {
        clearInterval(activeTacInterval);
        activeTacInterval = null;
      }
    }
    if (tacCloseBtn) tacCloseBtn.addEventListener('click', closeTacModal);
    if (tacBackdrop) tacBackdrop.addEventListener('click', closeTacModal);

    function closeDetailedStatsModal() {
      const dmodal = document.getElementById('detailed-stats-modal');
      if (dmodal) dmodal.hidden = true;
      stopLive2DPitchEngine();
    }
    const dstatsCloseBtn = document.getElementById('dstats-close-btn');
    const dstatsBackdrop = document.getElementById('dstats-backdrop');
    if (dstatsCloseBtn) dstatsCloseBtn.addEventListener('click', closeDetailedStatsModal);
    if (dstatsBackdrop) dstatsBackdrop.addEventListener('click', closeDetailedStatsModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const detailModal = document.getElementById('match-detail-modal');
        if (detailModal) detailModal.hidden = true;
        closeHoloModal();
        closeTacModal();
        closeDetailedStatsModal();
      }
    });

    // Global delegation for single match simulation buttons across all tournaments & leagues
    document.addEventListener('click', (e) => {
      // 0. Detailed Stats Popup Modal Trigger
      const dstatsBtn = e.target.closest('.btn-open-detailed-stats');
      if (dstatsBtn) {
        e.preventDefault();
        const stageKey = dstatsBtn.dataset.stage;
        const matchIdx = dstatsBtn.dataset.idx !== undefined ? parseInt(dstatsBtn.dataset.idx, 10) : undefined;
        const mdIdx = dstatsBtn.dataset.md !== undefined ? parseInt(dstatsBtn.dataset.md, 10) : undefined;
        const midx = dstatsBtn.dataset.midx !== undefined ? parseInt(dstatsBtn.dataset.midx, 10) : undefined;
        const homeTeam = dstatsBtn.dataset.home || 'Home';
        const awayTeam = dstatsBtn.dataset.away || 'Away';

        const state = tournamentState[activeTournKey];
        let match = null;

        if (stageKey && matchIdx !== undefined) {
          match = state?.[stageKey]?.[matchIdx];
        } else if (mdIdx !== undefined && midx !== undefined) {
          match = state?.matchdays?.[mdIdx]?.[midx];
        }

        if (!match) {
          match = {
            home: homeTeam,
            away: awayTeam,
            isSimulated: false,
            isLive: false,
            scoreHome: 0,
            scoreAway: 0,
            events: []
          };
        }

        openDetailedStatsModal(homeTeam, awayTeam, match, stageKey, matchIdx);
        return;
      }

      // Detailed Stats Modal Tab Pills
      const dstatsTab = e.target.closest('.dstats-tab-pill');
      if (dstatsTab) {
        e.preventDefault();
        const targetTab = dstatsTab.dataset.tab;
        document.querySelectorAll('.dstats-tab-pill').forEach(t => t.classList.remove('active'));
        dstatsTab.classList.add('active');
        document.querySelectorAll('.dstats-panel').forEach(p => p.classList.remove('active'));
        const targetPanel = document.getElementById(`dstats-panel-${targetTab}`);
        if (targetPanel) targetPanel.classList.add('active');
        return;
      }

      // 1. Fast On-Card Simulation
      const fastSimBtn = e.target.closest('.btn-card-fast-sim');
      if (fastSimBtn) {
        e.preventDefault();
        const stageKey = fastSimBtn.dataset.stage;
        const matchIdx = parseInt(fastSimBtn.dataset.idx, 10);
        simulateSingleMatch(stageKey, matchIdx);
        return;
      }

      // 2. Tactical Tracker Modal Simulation
      const simBtn = e.target.closest('.btn-sim-single, .btn-sim-league-match');
      if (simBtn) {
        e.preventDefault();
        const stageKey = simBtn.dataset.stage;
        const matchIdx = simBtn.dataset.idx !== undefined ? parseInt(simBtn.dataset.idx, 10) : undefined;
        const mdIdx = simBtn.dataset.md !== undefined ? parseInt(simBtn.dataset.md, 10) : undefined;
        const midx = simBtn.dataset.midx !== undefined ? parseInt(simBtn.dataset.midx, 10) : undefined;

        const state = tournamentState[activeTournKey];
        let match = null;

        if (stageKey && matchIdx !== undefined) {
          match = state?.[stageKey]?.[matchIdx];
          if (match) {
            openProTacticalTracker(match.home, match.away, match, stageKey, matchIdx);
          }
        } else if (mdIdx !== undefined && midx !== undefined) {
          match = state?.matchdays?.[mdIdx]?.[midx];
          if (match) {
            openProTacticalTracker(match.home, match.away, match, `md_${mdIdx}`, midx);
          }
        }
        return;
      }

      // btn-reopen-tactical is now merged into Match Report & Replay — redirect to detailed stats
      const replayBtn = e.target.closest('.btn-reopen-tactical');
      if (replayBtn) {
        e.preventDefault();
        const stageKey = replayBtn.dataset.stage;
        const matchIdx = parseInt(replayBtn.dataset.idx, 10);
        const state = tournamentState[activeTournKey];
        const match = state?.[stageKey]?.[matchIdx];
        if (match) {
          openDetailedStatsModal(match.home, match.away, match, stageKey, matchIdx);
        }
      }

      const holoBtn = e.target.closest('.btn-open-holo-broadcast');
      if (holoBtn) {
        e.preventDefault();
        const stageKey = holoBtn.dataset.stage;
        const matchIdx = parseInt(holoBtn.dataset.idx, 10);
        const state = tournamentState[activeTournKey];
        const match = state?.[stageKey]?.[matchIdx];
        if (match) {
          open3DHolographicBroadcast(match.home, match.away, match, stageKey, matchIdx);
        }
      }

      // SofaScore tab switching
      const sfcTab = e.target.closest('.sfc-tab');
      if (sfcTab) {
        e.preventDefault();
        const cardId = sfcTab.dataset.card;
        const targetPanel = sfcTab.dataset.tab;
        // Deactivate all tabs in this card
        document.querySelectorAll(`.sfc-tab[data-card="${cardId}"]`).forEach(t => t.classList.remove('active'));
        sfcTab.classList.add('active');
        // Hide all panels for this card
        document.querySelectorAll(`.sfc-panel[data-card="${cardId}"]`).forEach(p => p.classList.add('hidden'));
        // Show target panel
        const panel = document.querySelector(`.sfc-panel[data-card="${cardId}"][data-panel="${targetPanel}"]`);
        if (panel) panel.classList.remove('hidden');
      }
    });



    document.querySelectorAll('.chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeMediaChip = chip.dataset.chip || 'all';
        renderMediaGrid();
      });
    });

    const searchInput = document.getElementById('media-search-input');
    if (searchInput) searchInput.addEventListener('input', renderMediaGrid);
  }

  // ---------------------------------------------------------------------------
  // 12. WORLD CUP CUSTOM DRAW ENGINE
  // ---------------------------------------------------------------------------

  // In-session selected nations Set
  let customDrawSelected = new Set();
  let customDrawSearchQuery = '';
  let customDrawActiveConf = 'all';

  function getStrengthTier(str) {
    if (str >= 88) return 'elite';
    if (str >= 78) return 'strong';
    if (str >= 66) return 'mid';
    return 'lower';
  }

  function getStrengthLabel(str) {
    if (str >= 90) return 'WORLD CLASS';
    if (str >= 82) return 'ELITE';
    if (str >= 74) return 'STRONG';
    if (str >= 66) return 'MID';
    return 'LOWER';
  }

  function renderCustomDrawGrid() {
    const grid = document.getElementById('wc-draw-grid');
    if (!grid) return;

    let filtered = customDrawActiveConf === 'all'
      ? WC_ALL_NATIONS
      : WC_ALL_NATIONS.filter(n => n.conf === customDrawActiveConf);

    if (customDrawSearchQuery) {
      const q = customDrawSearchQuery.toLowerCase();
      filtered = filtered.filter(n => n.name.toLowerCase().includes(q) || n.conf.toLowerCase().includes(q));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:40px;color:rgba(255,255,255,0.3);font-family:var(--font-hud);font-size:0.8rem;letter-spacing:1px;">NO NATIONS FOUND</div>`;
      return;
    }

    grid.innerHTML = filtered.map(nation => {
      const sel = customDrawSelected.has(nation.name);
      const tier = getStrengthTier(nation.str);
      const strLabel = getStrengthLabel(nation.str);
      return `
        <div class="wc-nation-card ${sel ? 'selected' : ''} tier-${tier}" data-name="${nation.name}" title="${nation.conf} · FIFA Str: ${nation.str}">
          <div class="wc-nation-check">✓</div>
          <img class="wc-nation-flag" src="https://flagcdn.com/w40/${nation.flag}.png" alt="${nation.name}" loading="lazy" onerror="this.src='https://flagcdn.com/w40/un.png'">
          <span class="wc-nation-name">${nation.name}</span>
          <span class="wc-nation-str">${strLabel} · ${nation.str}</span>
        </div>`;
    }).join('');

    updateConfPills();
  }

  function updateConfPills() {
    const confKeys = ['all', 'UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
    const pillIds = {
      all: 'pill-all', UEFA: 'pill-uefa', CONMEBOL: 'pill-conmebol',
      CONCACAF: 'pill-concacaf', CAF: 'pill-caf', AFC: 'pill-afc', OFC: 'pill-ofc'
    };
    confKeys.forEach(conf => {
      const pill = document.getElementById(pillIds[conf]);
      if (!pill) return;
      const count = conf === 'all'
        ? [...customDrawSelected].length
        : [...customDrawSelected].filter(name => {
            const n = WC_ALL_NATIONS.find(x => x.name === name);
            return n && n.conf === conf;
          }).length;
      pill.textContent = count;
      pill.style.background = count > 0 ? 'rgba(46,204,113,0.3)' : 'rgba(255,255,255,0.12)';
    });
  }

  function updateCustomDrawProgress() {
    const countEl = document.getElementById('wc-draw-selected-count');
    const progressFill = document.getElementById('wc-draw-progress-fill');
    const tipEl = document.getElementById('wc-draw-tip');
    const startBtn = document.getElementById('wc-draw-btn-start');
    if (!countEl || !progressFill || !tipEl || !startBtn) return;

    const n = customDrawSelected.size;
    countEl.textContent = n;
    progressFill.style.width = `${Math.min(100, (n / 48) * 100)}%`;

    if (n < 48) {
      tipEl.textContent = `${48 - n} more needed to launch`;
      tipEl.style.color = '';
      startBtn.disabled = true;
      startBtn.classList.remove('ready');
    } else {
      tipEl.textContent = '✓ All 48 nations selected — ready!';
      tipEl.style.color = '#2ecc71';
      startBtn.disabled = false;
      startBtn.classList.add('ready');
    }

    progressFill.style.background = n >= 48
      ? 'linear-gradient(90deg, #1a6b35, #2ecc71)'
      : n >= 32
        ? 'linear-gradient(90deg, #d68910, #ffd700)'
        : 'linear-gradient(90deg, #c0392b, #e74c3c)';

    updateConfPills();
  }

  function openCustomDrawModal() {
    const modal = document.getElementById('wc-draw-modal');
    if (!modal) return;

    if (wcCustomTeams && wcCustomTeams.length === 48) {
      customDrawSelected = new Set(wcCustomTeams.map(t => t.toUpperCase().trim()));
    } else if (customDrawSelected.size === 0) {
      // Default: top 48 strongest nations
      const top48 = [...WC_ALL_NATIONS].sort((a, b) => b.str - a.str).slice(0, 48);
      customDrawSelected = new Set(top48.map(n => n.name));
    }

    customDrawActiveConf = 'all';
    customDrawSearchQuery = '';
    const searchInput = document.getElementById('wc-draw-search');
    if (searchInput) searchInput.value = '';
    const tabs = document.querySelectorAll('.wc-draw-tab');
    tabs.forEach(t => t.classList.toggle('active', t.dataset.conf === 'all'));

    renderCustomDrawGrid();
    updateCustomDrawProgress();

    modal.hidden = false;
    modal.removeAttribute('hidden');
    modal.style.setProperty('display', 'flex', 'important');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { if (searchInput) searchInput.focus(); }, 100);
  }

  function closeCustomDrawModal() {
    const modal = document.getElementById('wc-draw-modal');
    if (modal) {
      modal.hidden = true;
      modal.setAttribute('hidden', '');
      modal.style.setProperty('display', 'none', 'important');
      document.body.style.overflow = '';
    }
  }

  window.openCustomDrawModal = openCustomDrawModal;
  window.closeCustomDrawModal = closeCustomDrawModal;

  function setupCustomDrawModalHandlers() {
    const modal = document.getElementById('wc-draw-modal');
    const grid = document.getElementById('wc-draw-grid');
    const closeBtn = document.getElementById('wc-draw-close');
    const backdrop = document.getElementById('wc-draw-backdrop');
    const randomBtn = document.getElementById('wc-draw-btn-random');
    const resetBtn = document.getElementById('wc-draw-btn-reset');
    const startBtn = document.getElementById('wc-draw-btn-start');
    const searchInput = document.getElementById('wc-draw-search');
    const presetReal = document.getElementById('wc-draw-preset-real');
    const presetElite = document.getElementById('wc-draw-preset-elite');
    const tabs = document.querySelectorAll('.wc-draw-tab');

    // Real FIFA 2026 Confederation Allocation preset
    // UEFA:16, CONMEBOL:6, CONCACAF:6, CAF:9, AFC:8, OFC:1, Host:2 (USA/Canada/Mexico already in CONCACAF)
    const REAL_2026_ALLOCATIONS = { UEFA: 16, CONMEBOL: 6, CONCACAF: 6, CAF: 9, AFC: 8, OFC: 1, HOST: 2 };

    // Global trigger delegation
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#btn-wc-custom-draw, .wc-btn-custom-draw');
      if (trigger) { e.preventDefault(); e.stopPropagation(); openCustomDrawModal(); }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeCustomDrawModal);
    if (backdrop) backdrop.addEventListener('click', closeCustomDrawModal);
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal && !modal.hidden) closeCustomDrawModal();
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        customDrawSearchQuery = searchInput.value.trim();
        renderCustomDrawGrid();
      });
    }

    // Grid card clicks (event delegation)
    if (grid) {
      grid.addEventListener('click', (e) => {
        const card = e.target.closest('.wc-nation-card');
        if (!card) return;
        const name = card.dataset.name;
        if (!name) return;

        if (customDrawSelected.has(name)) {
          customDrawSelected.delete(name);
          card.classList.remove('selected');
        } else {
          if (customDrawSelected.size >= 48) {
            card.classList.add('shake');
            setTimeout(() => card.classList.remove('shake'), 400);
            return;
          }
          customDrawSelected.add(name);
          card.classList.add('selected');
        }
        updateCustomDrawProgress();
      });
    }

    // Confederation tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        customDrawActiveConf = tab.dataset.conf || 'all';
        renderCustomDrawGrid();
      });
    });

    // Random 48
    if (randomBtn) {
      randomBtn.addEventListener('click', () => {
        const shuffled = [...WC_ALL_NATIONS].sort(() => Math.random() - 0.5);
        customDrawSelected = new Set(shuffled.slice(0, 48).map(n => n.name));
        renderCustomDrawGrid();
        updateCustomDrawProgress();
      });
    }

    // Reset / clear all
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        customDrawSelected = new Set();
        renderCustomDrawGrid();
        updateCustomDrawProgress();
      });
    }

    // REAL 2026 preset — respects confederation allocation
    if (presetReal) {
      presetReal.addEventListener('click', () => {
        const confs = ['UEFA', 'CONMEBOL', 'CONCACAF', 'CAF', 'AFC', 'OFC'];
        const allocations = { UEFA: 16, CONMEBOL: 6, CONCACAF: 6, CAF: 9, AFC: 8, OFC: 1 };
        customDrawSelected = new Set();
        confs.forEach(conf => {
          const pool = WC_ALL_NATIONS.filter(n => n.conf === conf).sort((a, b) => b.str - a.str);
          const slots = allocations[conf] || 0;
          pool.slice(0, slots).forEach(n => customDrawSelected.add(n.name));
        });
        // Fill remaining 2 spots with top remaining teams
        if (customDrawSelected.size < 48) {
          const remaining = WC_ALL_NATIONS
            .filter(n => !customDrawSelected.has(n.name))
            .sort((a, b) => b.str - a.str);
          remaining.slice(0, 48 - customDrawSelected.size).forEach(n => customDrawSelected.add(n.name));
        }
        renderCustomDrawGrid();
        updateCustomDrawProgress();
      });
    }

    // TOP 48 ELITE preset — pure strength rating
    if (presetElite) {
      presetElite.addEventListener('click', () => {
        const top48 = [...WC_ALL_NATIONS].sort((a, b) => b.str - a.str).slice(0, 48);
        customDrawSelected = new Set(top48.map(n => n.name));
        renderCustomDrawGrid();
        updateCustomDrawProgress();
      });
    }

    // Launch simulation
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (customDrawSelected.size !== 48) return;
        wcCustomTeams = [...customDrawSelected];
        closeCustomDrawModal();
        initTournamentState('wc');
        const state = tournamentState['wc'];
        if (state) {
          state.subView = 'sim';
          activeStageFilter = 'all';
        }
        renderActiveTournament();
      });
    }
  }

  // ---------------------------------------------------------------------------
  // 13. HEADER BROADCAST ENGINE
  // ---------------------------------------------------------------------------

  // ---------------------------------------------------------------------------
  // 14. 3D INTERACTIVE CARD PARALLAX & SPECULAR GLOSS ENGINE
  // ---------------------------------------------------------------------------
  function init3DCardParallaxEngine() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let activeCard = null;
    let cardRect = null;
    let glareEl = null;

    function apply3DTilt(e) {
      if (!activeCard || !cardRect) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const x = clientX - cardRect.left;
      const y = clientY - cardRect.top;

      const relX = Math.max(0, Math.min(1, x / cardRect.width));
      const relY = Math.max(0, Math.min(1, y / cardRect.height));

      // Calculate 3D tilt angles (smooth ±18 degrees)
      const rotX = ((relY - 0.5) * -20).toFixed(2);
      const rotY = ((relX - 0.5) * 20).toFixed(2);

      activeCard.style.transform = `perspective(850px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.035, 1.035, 1.035)`;

      if (glareEl) {
        glareEl.style.background = `radial-gradient(circle at ${relX * 100}% ${relY * 100}%, rgba(255, 255, 255, 0.40) 0%, rgba(255, 255, 255, 0.08) 42%, transparent 78%)`;
        glareEl.style.opacity = '1';
      }
    }

    function reset3DTilt() {
      if (!activeCard) return;
      activeCard.style.transition = 'transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.35s ease';
      activeCard.style.transform = 'perspective(850px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      if (glareEl) {
        glareEl.style.opacity = '0';
      }

      const cardToClear = activeCard;
      setTimeout(() => {
        if (cardToClear && cardToClear !== activeCard) {
          cardToClear.style.transform = '';
          cardToClear.style.transition = '';
        }
      }, 350);

      activeCard = null;
      cardRect = null;
      glareEl = null;
    }

    // Global delegation for all interactive card elements
    document.addEventListener('mouseover', (e) => {
      const card = e.target.closest('.wc-nation-card, .single-stage-match-card, .fixture-card, .media-card, .champ-team-card, .champ-hero-stat-badge, .showcase-stat-card, .leader-item, .trophy-3d-stage');
      if (!card) return;

      activeCard = card;
      cardRect = card.getBoundingClientRect();
      activeCard.classList.add('card-3d-interactive');
      activeCard.style.transition = 'transform 0.08s ease-out';

      // Ensure specular glare element exists
      glareEl = activeCard.querySelector('.card-3d-glare');
      if (!glareEl && !activeCard.classList.contains('trophy-3d-stage')) {
        glareEl = document.createElement('div');
        glareEl.className = 'card-3d-glare';
        activeCard.appendChild(glareEl);
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (activeCard) {
        requestAnimationFrame(() => apply3DTilt(e));
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (!activeCard) return;
      const related = e.relatedTarget;
      if (!related || !activeCard.contains(related)) {
        reset3DTilt();
      }
    });
  }

  // ---------------------------------------------------------------------------
  // 14. MARIO STRIKER HEADER PITCH ENGINE
  // ---------------------------------------------------------------------------
  function initMarioStrikerEngine() {
    const actor = document.getElementById('mario-pitch-actor');
    const pitch = document.getElementById('header-pitch-track');
    const ballWrap = document.getElementById('mario-soccer-ball-wrap');
    const bubble = document.getElementById('mario-action-bubble');
    if (!actor || !pitch) return;

    let posX = 15; // percentage across header
    let speed = 0.18; // percent per frame
    let direction = 1; // 1 = right, -1 = left
    let isPowerShot = false;
    let powerShotProgress = 0;
    let isPaused = false;

    const phrases = [
      'GOAL! ⚽🔥', 'SUPER STRIKE! ⚡', 'HAT-TRICK! 🎩🎩🎩',
      'MAMA MIA! 🍄', 'ITS-A ME, SCORER! 🎉',
      'WAHOOOO! 🌟', 'POISSON CURVE! 📐💥',
      'ARENA CHAMP! 🏆', 'LET\'S-A GO! 🚀',
      'TOP BINS! 🎯', 'BELLISSIMO! 🇮🇹✨',
      'GOLAZO! 🥇🔥', '1-UP! 💚', 'GAME OVER? NEVER! 😤'
    ];

    actor.classList.add('running');

    function animateMario() {
      if (!isPaused) {
        if (isPowerShot) {
          powerShotProgress += 1.5;
          if (ballWrap) {
            const ballLead = direction === 1 ? powerShotProgress * 4 : -powerShotProgress * 4;
            ballWrap.style.transform = `translateX(${ballLead}px) rotate(${powerShotProgress * 25}deg)`;
          }

          if (powerShotProgress > 45) {
            isPowerShot = false;
            powerShotProgress = 0;
            actor.classList.remove('power-shot');
            if (ballWrap) {
              ballWrap.style.transition = 'transform 0.4s ease-out';
              ballWrap.style.transform = 'none';
              setTimeout(() => {
                if (ballWrap) ballWrap.style.transition = '';
              }, 400);
            }
          }
        } else {
          // Regular dribble cycle
          posX += speed * direction;

          // Boundary bounce with direction flip
          if (posX >= 88) {
            posX = 88;
            direction = -1;
            triggerDribbleTurn();
          } else if (posX <= 4) {
            posX = 4;
            direction = 1;
            triggerDribbleTurn();
          }

          actor.style.left = `${posX}%`;
          actor.style.transform = direction === -1 ? 'scaleX(-1)' : 'scaleX(1)';
        }
      }

      requestAnimationFrame(animateMario);
    }

    function triggerDribbleTurn() {
      actor.classList.remove('running');
      if (ballWrap) {
        ballWrap.style.transform = 'translateY(-6px)';
        setTimeout(() => { if (ballWrap) ballWrap.style.transform = 'none'; }, 200);
      }
      setTimeout(() => {
        actor.classList.add('running');
      }, 150);
    }

    function triggerSuperShot() {
      if (isPowerShot) return;
      isPowerShot = true;
      powerShotProgress = 0;
      actor.classList.add('power-shot');

      // Random celebration phrase
      if (bubble) {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        bubble.textContent = randomPhrase;
      }
    }

    function launchTacticalRadarFromBall() {
      triggerSuperShot();
      const state = tournamentState[activeTournKey];
      const match = state?.gf?.[0] || state?.sf?.[0] || state?.qf?.[0] || state?.r16?.[0] || state?.r32?.[0] || { home: 'Argentina', away: 'France', scoreHome: 3, scoreAway: 3 };
      const hTeam = match.home || 'Argentina';
      const aTeam = match.away || 'France';
      setTimeout(() => {
        openProTacticalTracker(hTeam, aTeam, match);
      }, 400);
    }

    // Click on Mario or Ball triggers super strike & opens KINEXON Tactical Radar
    actor.addEventListener('click', (e) => {
      e.stopPropagation();
      launchTacticalRadarFromBall();
    });

    if (ballWrap) {
      ballWrap.style.cursor = 'pointer';
      ballWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        launchTacticalRadarFromBall();
      });
    }

    actor.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        launchTacticalRadarFromBall();
      }
    });

    // Pause slightly on hover so user can appreciate details
    actor.addEventListener('mouseenter', () => {
      speed = 0.08;
    });
    actor.addEventListener('mouseleave', () => {
      speed = 0.18;
    });

    requestAnimationFrame(animateMario);
  }

  // ---------------------------------------------------------------------------
  // 15. DOM BOOTSTRAP
  // ---------------------------------------------------------------------------
  window.open3DHolographicBroadcast = open3DHolographicBroadcast;
  window.openProTacticalTracker = openProTacticalTracker;

  document.addEventListener('DOMContentLoaded', () => {
    buildLogoCache();
    setupNavigation();
    setupSimulationControls();
    setupModalHandlers();
    setupCustomDrawModalHandlers();
    init3DCardParallaxEngine();
    initMarioStrikerEngine();
    // Start on HOME view — selectTournament will set subView='home' via initTournamentState
    selectTournament('wc');
    switchView('tournament-home');
  });

})();


