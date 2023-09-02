const boton = document.getElementById("buscar");
boton.addEventListener("click", convertirMoneda);

const grafico = document.getElementById("grafico");
let montoCLP = "";
let monedaISO = "";
let valor = "";
let etiquetas = "";
let montoConvertido = "";

async function convertirMoneda() {
  console.log("convertirMoneda:boton clickeado");
  try {
    obtener_montoCLP();
    obtener_monedaISO();
    validarMontoCLP(montoCLP);
    traductorMonedaISO(monedaISO);
    await obtenerTipoCambio(moneda);
    calcularConversion(montoCLP, valor[0]);
    pintarResultado("Resultado: $" + montoConvertido);
    graficarMoneda();
  } catch (error) {
    pintarResultado(error.message);
  }
}

function obtener_montoCLP() {
  montoCLP = Number(document.getElementById("montoCLP").value);
  console.log("obtener_datos monto:", montoCLP);
}

function obtener_monedaISO(){
  monedaISO = document.getElementById("moneda").value;
  console.log("monedaISO:", monedaISO);
}
function validarMontoCLP(montoCLP) {
  if (Number.isNaN(montoCLP)) {
    console.log("Monto invalido");
    throw new Error("Monto Invalido");
  } else {
    console.log("Monto validado correctamente");
  }
}

function traductorMonedaISO(monedaISO) {
  switch (monedaISO) {
    case "USD":
      moneda = "dolar";
      break;
    case "EUR":
      moneda = "euro";
      break;
    default:
      console.error("Moneda no válida");
      throw new Error("La moneda seleccionada no es valida");
  }
  console.log("traductorMonedaISO", moneda);
  return moneda;
}
async function obtenerTipoCambio(moneda) {
  try {
    const response = await fetch(`https://mindicador.cl/api/${moneda}`);
    const data = await response.json();
    console.log("obtenerTipoCambio", data);
    valor = data.serie.slice(0, 10).map(entry => entry.valor);
    etiquetas = data.serie.slice(0, 10).map(entry => entry.fecha);
    console.log(`Valor of ${moneda}: ${valor}`);
    return;
  } catch (error) {
    console.error("Ha ocurrido un error al obtener el tipo de cambio", error);
    throw new Error("Ha ocurrido un error al obtener el tipo de cambio");
  }
}

function calcularConversion(montoCLP, valor) {
  montoConvertido = montoCLP / valor;
  console.log("monto convertido", montoConvertido, "=", montoCLP, "/", valor);
}

function pintarResultado(mensaje) {
  const resultado = document.getElementById("resultado");
  resultado.textContent = mensaje;
}

function graficarMoneda(){
  console.log("se inicia graficarmoneda")
  new Chart(grafico, {
    type: "line",
    data: {
      labels: etiquetas,
      datasets: [
        {
          label: "Tipo de cambio",
          data: valor,
          borderColor: "blue",
          backgroundColor: "white",
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: false,
        },
      },
    },
  });
}