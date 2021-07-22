$(function () {
  // Handler for .ready() called.

  /***Function: ValidateInputUser***/
  function validateInputUser(input) {
    if (input > 0 & input <= 731)
      return true;
    else {
      alert('Ingrese ún número desde el 1 a 731.');
      return false;
    }
  }

  /***Function: createInnerHtml*/
  function createHTML() {
    let html = `
                <div id="container-hero" class="container">
                  <div class="row row-cols-1 row-cols-lg-2">
                    <div class="col">
                      <article id="cardContainer">
                        <h3>SuperHero encontrado</h3>
                        <div class="card mb-3">
                          <div class="row g-0">
                            <div class="col-md-4 text-center text-md-start">
                              <img id="hero-img" src="" class="img-fluid rounded-start" alt="img">
                            </div>
                            <div class="col-md-8">
                              <div class="card-body">
                                <h5 class="card-title"><i>Nombre:</i><span id="hero-name"></span></h5>
                                <p class="card-text"><i>Conexiones:</i><span id="hero-connections-group-affiliation"></span></p>
                                <ul class="list-group list-group-flush">
                                  <li class="list-group-item"><i>Publicado por:</i><span id="hero-biography-publisher"></span></li>
                                  <li class="list-group-item"><i>Ocupación:</i><span id="hero-work-occupation"></span></li>
                                  <li class="list-group-item"><i>Primera Aparición:</i><span id="hero-biography-first-appearance"></span></li>
                                  <li class="list-group-item"><i>Altura:</i><span id="hero-appearance-height"></span></li>
                                  <li class="list-group-item"><i>Peso:</i><span id="hero-appearance-weight"></span></li>
                                  <li class="list-group-item"><i>Alianzas:</i><span id="hero-biography-aliases"></span></li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        </div>
                      </article>
                    </div>
                    <div class="col">
                      <article id="chartContainer">
                      </article>
                    </div>
                </div>
                </div>`;
    return html;
  }

  /***Function: createChart***/
  function createChart(id, title, ob, typeChart) {
    let problems = false;
    let chartPoints = [];
    for (att in ob) {
      let point = {};
      point.label = att;
      point.y = ob[att];
      chartPoints.push(point);
      if (point.y == 'null')
        problems = true;
    }
    id.CanvasJSChart({ //Pass chart options
      theme: "light1", // "light2", "dark1", "dark2"
      animationEnabled: true, // change to true		
      title: {
        text: "Estadísticas de poder para " + title
      },
      data: [{
        type: typeChart, //change it to column, spline, line, pie, etc
        startAngle: 270,
        showInLegend: "true",
        legendText: "{label}",
        indexLabel: "{label} ({y})",
        yValueFormatString: "#,##0.#" % "",
        dataPoints: chartPoints
      }],
    });
    if (problems)
      alert(`${title} tiene valores de estadisticas de poder null por ello el gráfico no se muestra.`);
  }

  /***Function: RenderData***/
  function renderData(json) {
    //Create HTML only one time
    if (varGlobal == 0)
      $('#response').append(createHTML());
    //Data Card
    $('#hero-img').prop('src', ' ' + json.image.url);
    $('#hero-name').text(' ' + json.name);
    $('#hero-connections-group-affiliation').text(' ' + json.connections['group-affiliation']);
    $('#hero-biography-publisher').text(' ' + json.biography.publisher);
    $('#hero-work-occupation').text(' ' + json.work.occupation);
    $('#hero-biography-first-appearance').text(' ' + json.biography['first-appearance']);
    $('#hero-appearance-height').text(' ' + json.appearance.height[1]);
    $('#hero-appearance-weight').text(' ' + json.appearance.weight[1]);
    $('#hero-biography-aliases').text(' ' + json.biography.aliases.toString().replaceAll(',', ', '));
    //Data Canvas
    createChart($('#chartContainer'), json.name, json.powerstats, 'pie');
    varGlobal=1;
  }

  /***Function: RequestToAPI***/
  function requestToAPI(a, hn) {
    let request = $.ajax({
      url: a.url + '/' + a.token + '/' + hn,
      type: a.method,
      dataType: 'json',
      success: function (json) {
        renderData(json);
      },
      error: function (xhr, status) {
        alert('Disculpe, hubo un problema para acceder a la API.');
      },
    });
  }

  /***MAIN***/
  var varGlobal = 0;
  let access = {
    url: 'https://superheroapi.com/api',
    token: '10158598456743026',
    method: 'GET'
  }
  //Event Submit
  $('#form-hero').submit(function (event) {
    event.preventDefault();
    let heroNumber = $('#hero-number').val();
    if (validateInputUser(heroNumber))
      requestToAPI(access, heroNumber)
  });
}); //End ready