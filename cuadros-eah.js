/* =========================================================================
   EAH // CUADROS ARTÍSTICOS — Lógica maestra
   Una sola página, tres pantallas: encuesta → galería → formulario
   ========================================================================= */

/* =========================================================================
   1) CONFIGURACIÓN EDITABLE (cambia aquí sin tocar el resto)
   ========================================================================= */
const CONFIG = {
  WHATSAPP: '5215518440848',          // número real con lada 52
  TARJETA: '5555 3333 2222 9991',
  MONEDA: 'MXN',
  STORAGE_KEY: 'eah_estado_v1',

  // Datos del negocio para el formulario
  NEGOCIO: {
    nombre: 'Cuadros Artísticos EAH',
    specs: '• Tamaño Carta: $400\n• Tamaño Doble Carta: $500\n• Tamaño Título: $600\n• Colores: Caoba, Negro, u otro a gusto.'
  },

  // Productos de la galería — edita libremente nombres, fotos, precios
  //coinimagenes
  PRODUCTOS: [
    {
      id: 'carta',
      nombre: 'Cuadro Carta — Modelo: Funcional, 6x8',
      subtitulo: 'Bastidor MDF, Formato Escritorio / Portarretrato · $400',
      descripcion: 'Cuadro Tamaño Carta con bastidores de MDF, Modelo: FUNCIONAL (chico), Color Caoba o Negro, Ideal para escritorio, buró o repisa: el recuerdo perfecto para tener siempre a la vista.',
      precio: 400,
      imagenes: [
        'imagenes/carta_1_6x8.png',
        'imagenes/carta_2_6x8.png',
        'imagenes/carta_3_6x8.png'
      ],
      //coincarta
    },
    {
      id: 'doble_carta',
      nombre: 'Cuadro Doble Carta — Modelo: Certeza, 10x12',
      subtitulo: 'Bastidor MDF, Formato amplio / Alta definición · $500',
      descripcion: 'Cuadro Tamaño Doble Carta con bastidores de MDF, Modelo: CERTEZA (mediano), Color Caoba o Negro, Ideal para composiciones panorámicas: paisajes, eventos familiares o tomas amplias que necesitan respirar.',
      precio: 500,
      imagenes: [
        'imagenes/doblecarta_1_10x12.png',
        'imagenes/doblecarta_2_10x12.png',
        'imagenes/doblecarta_3_10x12.png'
      ]
      //coindoblecarta
    },
    {
      id: 'titulo',
      nombre: 'Cuadro Título — Modelo: Legado, 12x18',
      subtitulo: 'Bastidor MDF, Diseño ejecutivo / Conmemorativo · $600',
      descripcion: 'Cuadro Tamaño Título con bastidor reforzado en MDF, Modelo: LEGADO (grande), Color Caoba o Negro, Ideal para piezas de colección o conmemorativas: máxima presencia visual y acabado resistente para durar generaciones.',
      precio: 600,
      imagenes: [
        'imagenes/titulo_1_12x18.png',
        'imagenes/titulo_2_12x18.png',
        'imagenes/titulo_3_12x18.png'
      ],
      //cointitulo
    }
  ]
};

/* =========================================================================
   2) UTILIDADES
   ========================================================================= */
const EAH = (() => {
  function leerEstado() {
    try {
      const raw = localStorage.getItem(CONFIG.STORAGE_KEY);
      if (!raw) return { modo: null, carrito: [], pedidos: [] };
      return JSON.parse(raw);
    } catch (e) {
      return { modo: null, carrito: [], pedidos: [] };
    }
  }
  function guardarEstado(st) {
    try { localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(st)); }
    catch (e) { console.error('No se pudo guardar', e); }
  }

  const getEstado = () => leerEstado();
  const setModo = (modo) => { const e = leerEstado(); e.modo = modo; guardarEstado(e); };
  const getModo = () => leerEstado().modo;

  const getCarrito = () => leerEstado().carrito || [];
  const setCarrito = (c) => { const e = leerEstado(); e.carrito = c; guardarEstado(e); };

  const getPedidos = () => leerEstado().pedidos || [];
  const setPedidos = (p) => { const e = leerEstado(); e.pedidos = p; guardarEstado(e); };

  function generarFolio() {
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dia = pad(now.getDate());
    const mes = pad(now.getMonth() + 1);
    const anio = now.getFullYear();
    const hh = pad(now.getHours());
    const mm = pad(now.getMinutes());
    const ss = pad(now.getSeconds());
    return `005-${dia}${mes}${anio}-${hh}${mm}${ss}`;
  }

  function abrirWhatsApp(mensaje) {
    const url = `https://wa.me/${CONFIG.WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  }

  function burbuja(cont, texto, esBot = true) {
    const d = document.createElement('div');
    d.className = 'burbuja ' + (esBot ? 'bot' : 'user');
    d.textContent = texto;
    cont.appendChild(d);
    cont.scrollTop = cont.scrollHeight;
    return d;
  }

  const esperar = (ms) => new Promise(r => setTimeout(r, ms));
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const precio = (n) => `$${n} ${CONFIG.MONEDA}`;

  return {
    getEstado, guardarEstado,
    getModo, setModo,
    getCarrito, setCarrito,
    getPedidos, setPedidos,
    generarFolio, abrirWhatsApp, burbuja, esperar, $, precio
  };
})();

/* =========================================================================
   3) CONTROL DE PANTALLAS
   ========================================================================= */
const Pantallas = (() => {
  const secciones = {
    encuesta: document.getElementById('pantalla-encuesta'),
    galeria: document.getElementById('pantalla-galeria'),
    formulario: document.getElementById('pantalla-formulario')
  };
  const tituloHeader = document.getElementById('header-titulo');

  //cointitulo
  const TITULOS = {
    encuesta: 'CHAT CLIENTE',
    galeria: 'CUADROS ARTÍSTICOS GALERÍA',
    formulario: 'CUADROS ARTÍSTICOS FORMULARIO'
  };

  function mostrar(nombre, tituloCustom) {
    Object.values(secciones).forEach(s => s.classList.remove('activa'));
    if (secciones[nombre]) secciones[nombre].classList.add('activa');
    tituloHeader.textContent = tituloCustom || TITULOS[nombre] || '';
  }

  function setTitulo(t) { tituloHeader.textContent = t; }

  return { mostrar, setTitulo };
})();

/* =========================================================================
   4) PANTALLA ENCUESTA
   ========================================================================= */
const Encuesta = (() => {
  const chat = document.getElementById('chat-encuesta');
  const botones = document.getElementById('botones-encuesta');

  function limpiarBotones() { botones.innerHTML = ''; }
  function boton(texto, clase, onClick, full = false) {
    const b = document.createElement('button');
    b.textContent = texto;
    b.className = (clase || '') + (full ? ' full' : '');
    b.addEventListener('click', onClick);
    botones.appendChild(b);
    return b;
  }

  async function iniciar() {
    chat.innerHTML = '';
    limpiarBotones();
    Pantallas.mostrar('encuesta');
    EAH.burbuja(chat, 'BIENVENIDO. Cuadros Artísticos Resina Epoxi...');
    await EAH.esperar(1200);
    pregunta1();
  }

  function pregunta1() {
    EAH.burbuja(chat, 'Hola! ¿Te gustan los recuerdos familiares y preservar la historia de los tuyos?');
    limpiarBotones();
    boton('SÍ', 'btn-accion-oro', () => resp1(true));
    boton('NO', 'btn-accion-gris', () => resp1(false));
  }

  async function resp1(si) {
    EAH.burbuja(chat, si ? 'SÍ' : 'NO', false);
    limpiarBotones();
    await EAH.esperar(700);
    si ? pregunta2() : finalizar('Muchas gracias por tu tiempo... ¡Hasta luego!');
  }

  function pregunta2() {
    EAH.burbuja(chat, 'Excelente. ¿Te gusta el arte, la estética visual y los cuadros exclusivos?');
    limpiarBotones();
    boton('SÍ, ME ENCANTA', 'btn-accion-oro', () => resp2(true));
    boton('NO MUCHO', 'btn-accion-gris', () => resp2(false));
  }

  async function resp2(si) {
    EAH.burbuja(chat, si ? 'SÍ, ME ENCANTA' : 'NO MUCHO', false);
    limpiarBotones();
    await EAH.esperar(700);
    si ? pregunta3() : finalizar('Entendido. Muchas gracias por tu interés. ¡Que tengas un gran día!');
  }

  function pregunta3() {
    EAH.burbuja(chat, 'Perfecto. ¿Prefieres adquirir cuadros para tu espacio personal o ganar un 20% de comisión ofreciendo la galería?');
    limpiarBotones();
    boton('COMPRAR PARA MÍ', 'btn-accion-oro', () => ruta('compra'));
    boton('GANAR 20% COMISIÓN', 'btn-accion-gris', () => ruta('comision'));
  }

  async function ruta(modo) {
    EAH.burbuja(chat, modo === 'compra' ? 'COMPRAR PARA MÍ' : 'GANAR 20% COMISIÓN', false);
    limpiarBotones();
    EAH.setModo(modo);
    await EAH.esperar(700);

    if (modo === 'compra') {
      EAH.burbuja(chat, 'Genial. ¿Ya conoces la galería actual y los tamaños, o es tu primera vez explorando la obra?');
      mostrarBotonesNavegacion('compra');
      return;
    }

    // Ruta comisión: burbujas encadenadas con pausas cortas (lectura natural)
    const mensajesComision = [
      '🏆 Excelente decisión. Muchas gracias por emprender y por querer ser parte del equipo EAH.',
      'Funciona así: tú muestras la galería, el cliente elige su cuadro y tú recibes 20% de comisión 💵 por cada venta cerrada. ✅',
      'Y si tienes un negocio (tienda, estética, papelería, café... ☕🛍️💅), puede convertirse en PUNTO DE ENTREGA oficial. Así tus clientes recogen ahí y tú ganas más visibilidad.',
      'Como socio recibes: lona publicitaria de los cuadros con código QR en tu negocio 📜, tarjetas de presentación personalizadas 💳, galería física con 3 cuadros de muestra + reja aparador 🎨🖼️, y la galería digital lista para compartir. 🌟'
    ];

    for (const msg of mensajesComision) {
      EAH.burbuja(chat, msg);
      await EAH.esperar(900);
    }

    EAH.burbuja(chat, 'Para arrancar a recomendar con tu 20%, ¿conoces la galería o prefieres ir directo al formulario de registro de socio?');
    mostrarBotonesNavegacion('comision');
  }

  // Botones de bifurcación: Ver Galería | Ir a Formulario
  function mostrarBotonesNavegacion(modo) {
    limpiarBotones();
    boton('VER GALERÍA', 'btn-accion-oro', () => Galeria.mostrarMenu(), false);
    boton('IR A FORMULARIO', 'btn-accion-gris', () => Formulario.mostrar(), false);
  }

  function finalizar(mensaje) {
    EAH.burbuja(chat, mensaje);
    limpiarBotones();
    boton('VOLVER A EMPEZAR', 'btn-accion-gris full', iniciar, true);
  }

  return { iniciar };
})();

/* =========================================================================
   5) PANTALLA GALERÍA
   ========================================================================= */
const Galeria = (() => {
  const cont = document.getElementById('contenido-galeria');
  const botones = document.getElementById('botones-galeria');
  let productoActual = null;

  function limpiar() {
    cont.innerHTML = '';
    botones.innerHTML = '';
  }
  function boton(texto, clase, onClick, full = false) {
    const b = document.createElement('button');
    b.textContent = texto;
    b.className = (clase || '') + (full ? ' full' : '');
    b.addEventListener('click', onClick);
    botones.appendChild(b);
    return b;
  }
  function enlaceVolver(texto, onClick) {
    const b = document.createElement('button');
    b.className = 'enlace-volver';
    b.textContent = texto;
    b.addEventListener('click', onClick);
    cont.appendChild(b);
  }

  /* --- MENÚ PRINCIPAL --- */
  function mostrarMenu() {
    limpiar();
    Pantallas.mostrar('galeria');

    const modo = EAH.getModo();
    const carrito = EAH.getCarrito();
    const pedidos = EAH.getPedidos();

    if (modo === 'comision') {
      // Tarjeta informativa de socio comercial
      const card = document.createElement('div');
      card.className = 'tarjeta-socio';
      card.innerHTML =
        '<h3>MODO SOCIO COMERCIAL — 20%</h3>' +
        '<p>Tu 20% se calcula sobre el precio de venta de cada cuadro. ' +
        'Muestras la galería, cierras el pedido y recibes tu comisión al confirmar el pago.</p>' +
        '<p><strong>Beneficios del socio:</strong></p>' +
        '<ul>' +
        '  <li>Lona publicitaria de los cuadros en tu negocio, con código QR</li>' +
        '  <li>Tarjetas de presentación personalizadas de los cuadros</li>' +
        '  <li>Galería física en tu negocio (3 cuadros de muestra + reja aparador)</li>' +
        '  <li>Posibilidad de ser PUNTO DE ENTREGA oficial</li>' +
        '</ul>';
      cont.appendChild(card);
    }

    let txt = 'Bienvenido a la Galería EAH. Selecciona una categoría de cuadro para ver detalles:';
    if (carrito.length > 0) {
      txt += `\n\n[ Carrito: ${carrito.length} producto(s) guardado(s) sin folio ]`;
    }
    if (pedidos.length > 0) {
      txt += `\n\n[ Pedidos con Folio Activo: ${pedidos.length} ]`;
    }
    EAH.burbuja(cont, txt);

    CONFIG.PRODUCTOS.forEach(p => {
      const b = document.createElement('button');
      b.className = 'tarjeta-producto';
      b.innerHTML = `${p.nombre}<small>${p.subtitulo}</small>`;
      b.addEventListener('click', () => abrirDetalle(p.id));
      cont.appendChild(b);
    });

    boton('VER CARRITO Y RASTREAR PEDIDOS', 'btn-accion-gris full', abrirRastreo, true);
    boton('CERRAR GALERÍA', 'btn-accion-oro full', () => {
      limpiar();
      EAH.burbuja(cont, 'Gracias por visitar EAH. Puedes cerrar esta pestaña.');
      boton('VOLVER AL INICIO', 'btn-accion-gris full', Encuesta.iniciar, true);
    }, true);
  }

  // --- Slider estilo Amazon ---
  let sliderImgs = [];      // rutas válidas (las que sí cargaron)
  let sliderIdx = 0;

  function construirSlider(p) {
    sliderImgs = [];
    sliderIdx = 0;

    // Contenedor principal del slider
    const wrap = document.createElement('div');
    wrap.className = 'slider';

    // Imagen grande
    const imgGrande = document.createElement('img');
    imgGrande.className = 'slider-img';
    imgGrande.id = 'slider-img-grande';
    imgGrande.alt = p.nombre;

    // Flecha izquierda
    const btnPrev = document.createElement('button');
    btnPrev.className = 'slider-flecha slider-prev';
    btnPrev.type = 'button';
    btnPrev.innerHTML = '&#10094;';
    btnPrev.setAttribute('aria-label', 'Anterior');
    btnPrev.addEventListener('click', () => moverSlider(-1));

    // Flecha derecha
    const btnNext = document.createElement('button');
    btnNext.className = 'slider-flecha slider-next';
    btnNext.type = 'button';
    btnNext.innerHTML = '&#10095;';
    btnNext.setAttribute('aria-label', 'Siguiente');
    btnNext.addEventListener('click', () => moverSlider(1));

    wrap.appendChild(btnPrev);
    wrap.appendChild(imgGrande);
    wrap.appendChild(btnNext);
    cont.appendChild(wrap);

    // Miniaturas
    const thumbs = document.createElement('div');
    thumbs.className = 'slider-thumbs';
    thumbs.id = 'slider-thumbs';
    cont.appendChild(thumbs);

    // Precargar imágenes: solo las que existen entran al slider
    let pendientes = p.imagenes.length;
    p.imagenes.forEach((ruta, i) => {
      const test = new Image();
      test.onload = () => {
        sliderImgs[i] = { ruta, ok: true };
        pendientes--;
        if (pendientes === 0) refrescarSlider();
      };
      test.onerror = () => {
        sliderImgs[i] = { ruta, ok: false };
        pendientes--;
        if (pendientes === 0) refrescarSlider();
      };
      test.src = ruta;
    });
  }

  function moverSlider(dir) {
    const validas = sliderImgs.filter(x => x && x.ok);
    if (validas.length === 0) return;

    // Encontrar posición actual dentro de las válidas
    let actual = sliderImgs.findIndex(x => x && x.ok && x.ruta === sliderImgs[sliderIdx]?.ruta);
    if (actual === -1) actual = 0;

    const nuevasValidas = sliderImgs
      .map((x, i) => ({ ...x, i }))
      .filter(x => x && x.ok);

    let posActual = nuevasValidas.findIndex(x => x.i === sliderIdx);
    if (posActual === -1) posActual = 0;

    let nuevaPos = (posActual + dir + nuevasValidas.length) % nuevasValidas.length;
    sliderIdx = nuevasValidas[nuevaPos].i;
    refrescarSlider();
  }

  function refrescarSlider() {
    const validas = sliderImgs
      .map((x, i) => ({ ...x, i }))
      .filter(x => x && x.ok);

    const img = document.getElementById('slider-img-grande');
    const thumbs = document.getElementById('slider-thumbs');
    if (!img || !thumbs) return;

    if (validas.length === 0) {
      img.style.display = 'none';
      thumbs.innerHTML = '';
      return;
    }
    img.style.display = 'block';

    // Si el índice actual no es válido, arrancar en el primero
    if (!validas.find(v => v.i === sliderIdx)) {
      sliderIdx = validas[0].i;
    }

    img.src = sliderImgs[sliderIdx].ruta;

    // Miniaturas
    thumbs.innerHTML = '';
    validas.forEach(v => {
      const t = document.createElement('img');
      t.className = 'slider-thumb' + (v.i === sliderIdx ? ' activa' : '');
      t.src = v.ruta;
      t.alt = 'Vista ' + (v.i + 1);
      t.addEventListener('click', () => {
        sliderIdx = v.i;
        refrescarSlider();
      });
      thumbs.appendChild(t);
    });
  }

  /* --- DETALLE DEL PRODUCTO --- */
  function abrirDetalle(id) {
    const p = CONFIG.PRODUCTOS.find(x => x.id === id);
    if (!p) return;
    productoActual = p;
    limpiar();
    Pantallas.setTitulo('CUADROS ARTÍSTICOS DETALLES');

    // --- SLIDER tipo Amazon ---
    construirSlider(p);

    // Descripción
    const desc = document.createElement('p');
    desc.className = 'desc-producto';
    desc.textContent = p.descripcion;
    cont.appendChild(desc);

    // Precio
    const pr = document.createElement('div');
    pr.className = 'precio';
    pr.textContent = EAH.precio(p.precio) + ' c/u';
    cont.appendChild(pr);

    // Cantidad
    const cant = document.createElement('div');
    cant.className = 'cantidad';
    cant.innerHTML = `<label for="qty">Cantidad:</label>
                      <input id="qty" type="number" min="1" max="10" value="1">`;
    cont.appendChild(cant);

    enlaceVolver('← Regresar a Galería Principal', mostrarMenu);

    // Botones inferiores
    boton('GUARDAR EN CARRITO', 'btn-accion-oro', guardarEnCarrito);
    boton('COMPRAR AHORA', 'btn-accion-gris', comprarAhora);
  }

  function leerCantidad() {
    const inp = document.getElementById('qty');
    let n = parseInt(inp.value, 10);
    if (isNaN(n) || n < 1) n = 1;
    if (n > 10) n = 10;
    return n;
  }

  function guardarEnCarrito() {
    const qty = leerCantidad();
    const carrito = EAH.getCarrito();
    carrito.push({
      tipo_id: productoActual.id,
      nombre: productoActual.nombre,
      cantidad: qty,
      precio_unitario: productoActual.precio
    });
    EAH.setCarrito(carrito);
    alert('✅ Artículo guardado en tu carrito.');
    mostrarMenu();
  }

  function comprarAhora() {
    const qty = leerCantidad();
    const total = qty * productoActual.precio;
    const folio = EAH.generarFolio();
    const pedidos = EAH.getPedidos();
    const pedido = {
      folio,
      total,
      producto: `${qty} x ${productoActual.nombre}`,
      comprobante: null,
      estado: 'Pendiente de Pago'
    };
    pedidos.push(pedido);
    EAH.setPedidos(pedidos);

    const ticket =
      '=== TICKET DIGITAL FOLIO GENERADO ===\n\n' +
      `Folio Único: ${folio}\n` +
      `Producto: ${pedido.producto}\n` +
      `Total a Depositar: $${total} ${CONFIG.MONEDA}\n\n` +
      `Tarjeta Banco Azteca:\n${CONFIG.TARJETA}\n\n` +
      'Folio generado con éxito. Ve a "Rastrear Pedidos" para adjuntar tu comprobante.';
    alert(ticket);
    verDetallePedido(pedido);
  }

  /* --- RASTREO / CARRITO --- */
  function abrirRastreo() {
    limpiar();
    Pantallas.setTitulo('CUADROS ARTÍSTICOS RASTREO');

    const carrito = EAH.getCarrito();
    const pedidos = EAH.getPedidos();

    if (carrito.length > 0) {
      const t = document.createElement('div');
      t.className = 'seccion-titulo';
      t.textContent = 'Artículos en Carrito (Sin Folio):';
      cont.appendChild(t);

      carrito.forEach((item, idx) => {
        const fila = document.createElement('div');
        fila.className = 'fila-item';

        const btn = document.createElement('button');
        btn.className = 'item-btn';
        const subtotal = item.cantidad * item.precio_unitario;
        btn.textContent = `${item.cantidad} x ${item.nombre} ($${subtotal} ${CONFIG.MONEDA})\n> Clic para ver detalle y generar folio`;
        btn.addEventListener('click', () => regresarADetalle(item, idx));
        fila.appendChild(btn);

        const del = document.createElement('button');
        del.className = 'btn-borrar';
        del.textContent = '×';
        del.addEventListener('click', () => {
          const c = EAH.getCarrito();
          c.splice(idx, 1);
          EAH.setCarrito(c);
          abrirRastreo();
        });
        fila.appendChild(del);

        cont.appendChild(fila);
      });
    }

    if (pedidos.length > 0) {
      const t = document.createElement('div');
      t.className = 'seccion-titulo';
      t.style.color = 'var(--accent)';
      t.textContent = 'Pedidos con Folio Activo:';
      cont.appendChild(t);

      pedidos.forEach((pedido, idx) => {
        const fila = document.createElement('div');
        fila.className = 'fila-item';

        const btn = document.createElement('button');
        btn.className = 'item-btn';
        btn.style.color = 'var(--texto-user)';
        const estado = pedido.comprobante ? 'Ticket Cargado OK' : 'Sin Comprobante';
        btn.textContent = `Folio: ${pedido.folio}\nProd: ${pedido.producto} ($${pedido.total})\nEstado: ${estado}`;
        btn.addEventListener('click', () => verDetallePedido(pedido));
        fila.appendChild(btn);

        const del = document.createElement('button');
        del.className = 'btn-borrar';
        del.textContent = '×';
        del.addEventListener('click', () => {
          const p = EAH.getPedidos();
          p.splice(idx, 1);
          EAH.setPedidos(p);
          abrirRastreo();
        });
        fila.appendChild(del);

        cont.appendChild(fila);
      });
    }

    if (carrito.length === 0 && pedidos.length === 0) {
      const v = document.createElement('div');
      v.className = 'mensaje-vacio';
      v.textContent = 'No tienes artículos en el carrito ni pedidos generados.';
      cont.appendChild(v);
    }

    

    boton('← Volver a Galería Principal', 'btn-accion-gris full', mostrarMenu, true);
  }

  function regresarADetalle(item, idx) {
    const c = EAH.getCarrito();
    c.splice(idx, 1);
    EAH.setCarrito(c);
    abrirDetalle(item.tipo_id);
  }

  /* --- DETALLE DE PEDIDO CON FOLIO --- */
  function verDetallePedido(pedido) {
    limpiar();
    Pantallas.setTitulo('FOLIO: ' + pedido.folio);

    const detalle =
      `Folio: ${pedido.folio}\n` +
      `Producto: ${pedido.producto}\n` +
      `Total: $${pedido.total} ${CONFIG.MONEDA}\n` +
      `Estado Actual: ${pedido.estado}\n` +
      `Comprobante: ${pedido.comprobante || 'Pendiente de adjuntar'}`;
    EAH.burbuja(cont, detalle);

    boton('ADJUNTAR / CAMBIAR TICKET', 'btn-accion-oro full', () => adjuntarComprobante(pedido), true);

    if (pedido.comprobante) {
      boton('ENVIAR PEDIDO POR WHATSAPP', 'btn-whats full', () => enviarPorWhatsApp(pedido), true);
    } else {
      const b = boton('[ Adjunta ticket para habilitar WhatsApp ]', 'btn-accion-gris full', () => { }, true);
      b.disabled = true;
    }

    boton('← Regresar a Carrito y Rastreo', 'btn-accion-gris full', abrirRastreo, true);
  }

  function adjuntarComprobante(pedido) {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = 'image/*,.pdf';
    inp.addEventListener('change', () => {
      if (!inp.files || inp.files.length === 0) return;
      const archivo = inp.files[0];
      // En web no podemos leer la ruta real, solo el nombre
      const nombreArchivo = archivo.name;

      const pedidos = EAH.getPedidos();
      const idx = pedidos.findIndex(p => p.folio === pedido.folio);
      if (idx !== -1) {
        pedidos[idx].comprobante = nombreArchivo;
        pedidos[idx].estado = 'Comprobante Recibido';
        EAH.setPedidos(pedidos);
        pedido.comprobante = nombreArchivo;
        pedido.estado = 'Comprobante Recibido';
      }

      EAH.burbuja(cont, `Comprobante cargado para [${pedido.folio}]: ${nombreArchivo}`, false);
      EAH.burbuja(cont, 'Excelente. Ahora puedes enviar tu pedido directamente a WhatsApp.');
      verDetallePedido(pedido);
    });
    inp.click();
  }

  function enviarPorWhatsApp(pedido) {
    const msg =
      'Hola Ernesto, acabo de realizar un pago e integrado mi comprobante:\n\n' +
      `- Folio: ${pedido.folio}\n` +
      `- Producto: ${pedido.producto}\n` +
      `- Total: $${pedido.total} ${CONFIG.MONEDA}\n` +
      `- Comprobante adjunto: ${pedido.comprobante}\n\n` +
      'Quedo a la espera de confirmación para la producción del cuadro.';
    EAH.abrirWhatsApp(msg);
  }

  return { mostrarMenu, abrirDetalle, abrirRastreo, verDetallePedido };
})();

/* =========================================================================
   6) PANTALLA FORMULARIO
   ========================================================================= */
const Formulario = (() => {
  const cont = document.getElementById('contenido-formulario');
  const botones = document.getElementById('botones-formulario');

  function limpiar() {
    cont.innerHTML = '';
    botones.innerHTML = '';
  }
  function boton(texto, clase, onClick, full = false) {
    const b = document.createElement('button');
    b.textContent = texto;
    b.className = (clase || '') + (full ? ' full' : '');
    b.addEventListener('click', onClick);
    botones.appendChild(b);
    return b;
  }

  function mostrar() {
    limpiar();
    Pantallas.mostrar('formulario');


    // Campo Nombre
    const c1 = document.createElement('div');
    c1.className = 'campo';
    c1.innerHTML = '<label for="f-nombre">Nombre:</label><input id="f-nombre" type="text" placeholder="Tu nombre completo">';
    cont.appendChild(c1);

    // Campo Contacto
    const c2 = document.createElement('div');
    c2.className = 'campo';
    c2.innerHTML = '<label for="f-contacto">Teléfono o Correo:</label><input id="f-contacto" type="text" placeholder="Ej: 5512345678 o tu@correo.com">';
    cont.appendChild(c2);

    // Campo Solicitud
    const c3 = document.createElement('div');
    c3.className = 'campo';
    c3.innerHTML = '<label for="f-solicitud">Solicitud (¿Cómo quieres tu cuadro?):</label><textarea id="f-solicitud" placeholder="Describe el cuadro que deseas..."></textarea>';
    cont.appendChild(c3);

    // Especificaciones
    const sp = document.createElement('div');
    sp.className = 'specs';
    sp.innerHTML = `<h3>Especificaciones y Costos:</h3><p>${CONFIG.NEGOCIO.specs}</p>`;
    cont.appendChild(sp);

    // Bloque archivo (oculto hasta detectar @)
    const ab = document.createElement('div');
    ab.className = 'archivo-bloque';
    ab.id = 'bloque-archivo';
    ab.innerHTML = `
      <label>Archivo Adjunto (Detectado por correo):</label>
      <div class="archivo-info" id="info-archivo">Ningún archivo seleccionado</div>
      <button class="btn-azul" id="btn-examinar" style="padding:8px 14px;border:none;border-radius:6px;font-family:inherit;font-weight:700;color:#fff;cursor:pointer;">Examinar archivo...</button>
    `;
    cont.appendChild(ab);

    // Estado
    const estado = document.createElement('div');
    estado.className = 'estado';
    estado.id = 'estado-form';
    cont.appendChild(estado);

    // Botones inferiores
    boton('ENVIAR', 'btn-accion-oro', enviar);
    boton('RESET', 'btn-reset-oro', reset);
    boton('← Volver al Inicio', 'btn-accion-gris full', Encuesta.iniciar, true);

    // Eventos
    const contacto = document.getElementById('f-contacto');
    contacto.addEventListener('input', evaluarTipoContacto);

    document.getElementById('btn-examinar').addEventListener('click', () => {
      const inp = document.createElement('input');
      inp.type = 'file';
      inp.accept = 'image/*,.pdf';
      inp.addEventListener('change', () => {
        if (inp.files && inp.files.length > 0) {
          const info = document.getElementById('info-archivo');
          info.textContent = inp.files[0].name;
          info.classList.add('cargado');
        }
      });
      inp.click();
    });
  }

  function evaluarTipoContacto() {
    const val = document.getElementById('f-contacto').value;
    const bloque = document.getElementById('bloque-archivo');
    if (val.includes('@')) {
      bloque.classList.add('visible');
    } else {
      bloque.classList.remove('visible');
    }
  }

  function reset() {
    document.getElementById('f-nombre').value = '';
    document.getElementById('f-contacto').value = '';
    document.getElementById('f-solicitud').value = '';
    document.getElementById('bloque-archivo').classList.remove('visible');
    const info = document.getElementById('info-archivo');
    info.textContent = 'Ningún archivo seleccionado';
    info.classList.remove('cargado');
    document.getElementById('estado-form').textContent = '';
  }

  function enviar() {
    const nombre = document.getElementById('f-nombre').value.trim();
    const contacto = document.getElementById('f-contacto').value.trim();
    const solicitud = document.getElementById('f-solicitud').value.trim();
    const estado = document.getElementById('estado-form');

    if (!nombre || !contacto || !solicitud) {
      estado.style.color = 'var(--danger)';
      estado.textContent = 'Por favor completa todos los campos requeridos.';
      return;
    }

    const esCorreo = contacto.includes('@');

    if (esCorreo) {
      estado.style.color = '#ffeb3b';
      estado.textContent = 'Procesando envío por correo electrónico...';

      // Equivalente web: mailto (abre el cliente de correo del usuario)
      const asunto = encodeURIComponent('Solicitud de cuadro - ' + nombre);
      const cuerpo = encodeURIComponent(
        `Nombre: ${nombre}\nCorreo: ${contacto}\n\nSolicitud:\n${solicitud}\n\n-- Enviado desde la galería EAH`
      );
      window.open(`mailto:${contacto}?subject=${asunto}&body=${cuerpo}`, '_blank');

      setTimeout(() => {
        estado.style.color = 'var(--accent)';
        estado.textContent = 'Se preparó el correo. Revisa tu cliente de correo y envíalo.';
        reset();
      }, 1200);
    } else {
      // WhatsApp
      const texto =
        'Hola, quiero hacer un pedido:\n' +
        `- Nombre: ${nombre}\n` +
        `- Teléfono: ${contacto}\n` +
        `- Solicitud: ${solicitud}`;
      EAH.abrirWhatsApp(texto);
      estado.style.color = 'var(--accent)';
      estado.textContent = 'Se abrió WhatsApp. No olvides adjuntar tu foto.';
      reset();
    }
  }

  return { mostrar };
})();

/* =========================================================================
   7) ARRANQUE
   ========================================================================= */
window.addEventListener('DOMContentLoaded', () => {
  Compartir.iniciar();
  Encuesta.iniciar();
});

/* =========================================================================
   8) BOTÓN COMPARTIR (Web Share API + fallback)
   ========================================================================= */
const Compartir = (() => {
  const URL_SITIO = window.location.origin + window.location.pathname;

  const MENSAJE =
    'Hola! Te comparto la galeria de Cuadros Artisticos EAH.\n\n' +
    'Cuadros en resina epoxi hechos a mano, con bastidor MDF y acabados ' +
    'en caoba o negro. Tamaños carta, doble carta y titulo.\n\n' +
    'Aqui puedes ver el catalogo completo y hacer tu pedido:\n' +
    URL_SITIO + '\n\n' +
    'Cualquier duda me dices. Gracias por compartir!';

  async function compartir() {
    // 1. Intento con Web Share API (nativo en celular: WhatsApp, etc.)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cuadros Artisticos EAH',
          text: MENSAJE
        });
        return;
      } catch (e) {
        // El usuario cancelo, o el navegador lo bloqueo. Seguimos al fallback.
      }
    }

    // 2. Fallback: copiar al portapapeles + intentar abrir WhatsApp Web
    const copiado = await copiarPortapapeles(MENSAJE);
    if (copiado) {
      alert(
        'Mensaje copiado al portapapeles.\n\n' +
        'Abre WhatsApp y pegalo en el chat de quien quieras invitarlo.'
      );
    } else {
      // 3. Ultimo recurso: abrir WhatsApp Web con el mensaje prellenado
      const wa = 'https://wa.me/?text=' + encodeURIComponent(MENSAJE);
      window.open(wa, '_blank');
    }
  }

  async function copiarPortapapeles(texto) {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(texto);
        return true;
      }
      // Fallback clasico con textarea
      const ta = document.createElement('textarea');
      ta.value = texto;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch (e) {
      return false;
    }
  }

  function iniciar() {
    const btn = document.getElementById('btn-compartir');
    if (btn) btn.addEventListener('click', compartir);
  }

  return { iniciar };
})();