import { Component, OnInit } from '@angular/core';

declare const $:any;

@Component({
  selector: 'app-livetv',
  templateUrl: './livetv.component.html',
  styleUrls: ['./livetv.component.css']
})
export class LivetvComponent implements OnInit {

  ngOnInit(): void {

    // FileInput
    $('.form-file-simple .inputFileVisible').click(function() {
      $(this).siblings('.inputFileHidden').trigger('click');
    });

    $('.form-file-simple .inputFileHidden').change(function() {
      var filename = $(this).val().replace(/C:\\fakepath\\/i, '');
      $(this).siblings('.inputFileVisible').val(filename);
    });

    $('.form-file-multiple .inputFileVisible, .form-file-multiple .input-group-btn').click(function() {
      $(this).parent().parent().find('.inputFileHidden').trigger('click');
      $(this).parent().parent().addClass('is-focused');
    });

    $('.form-file-multiple .inputFileHidden').change(function() {
      var names = '';
      for (var i = 0; i < $(this).get(0).files.length; ++i) {
        if (i < $(this).get(0).files.length - 1) {
          names += $(this).get(0).files.item(i).name + ',';
        } else {
          names += $(this).get(0).files.item(i).name;
        }
      }
      $(this).siblings('.input-group').find('.inputFileVisible').val(names);
    });

    $('.form-file-multiple .btn').on('focus', function() {
      $(this).parent().siblings().trigger('focus');
    });

    $('.form-file-multiple .btn').on('focusout', function() {
      $(this).parent().siblings().trigger('focusout');
    });

    // FileInput END


    // select category on channel input-create-channel-category
    $.ajax({
      type: 'get',
      url: 'http://34.70.3.128/categories',
      dataType: 'json',
      success (response) {
        response.forEach((category) => {
          $('#select-create-channel-category').append(`<option value="${category._id}">${category.nombre}</option>`)
        })
        $("#select-create-channel-category").selectpicker('refresh')
      },
    })

    let DatatableChannels = null
    $(document).ready(function () {
      // md.initFormExtendedDatetimepickers();
      // Javascript method's body can be found in assets/js/demos.js
      // md.initDashboardPageCharts();

      // md.initVectorMap();

      // Datatable
      DatatableChannels = $("#datatable-channels").DataTable({
        pagingType: "full_numbers",
        lengthMenu: [
          [10, 25, 50, -1],
          [10, 25, 50, "All"]
        ],
        responsive: true,
        processing: true,
        serverSide: true,
        language: {
          "sProcessing": "Conectando...",
          "sLengthMenu": "Mostrar _MENU_ canales",
          "sZeroRecords": "No se encontraron resultados",
          "sEmptyTable": "Ningún dato disponible en esta tabla",
          "sInfo": "Resultados del _START_ al _END_ de _TOTAL_",
          "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
          "sInfoFiltered": "(de un total de _MAX_ resultados)",
          "sInfoPostFix": "",
          "sSearch": "Buscar:",
          "sSearchPlaceholder": "",
          "sUrl": "",
          "sInfoThousands": ",",
          "sLoadingRecords": "Cargando...",
          "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
          },
          "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
          }
        },
        ajax: {
          url: 'http://34.70.3.128/channels/datatable',
          dataSrc (response) {
            for (const channel of response.data) {
              channel.icono = `<img class="img" src="${channel.icono}" width="35">`
              channel.settings = '<a title="Agregar Programación" href="#" class="btn btn-link btn-warning btn-just-icon create-epg"><i class="material-icons">add_to_queue</i><div class="ripple-container"></div></a>'
            }
            return response.data
          },
        },
        order: [[0, 'asc']],
        columns: [
          {
            data: "numero",
            className: "text-center",
          },
          {
            data: "nombre",
            className: "text-center",
          },
          /* {
            data: "epgid",
            className: 'text-center',
          }, */
          {
            data: "icono",
            className: 'text-center',
          },
          {
            data: "categoryName",
            className: 'text-center',
          },
          {
            data: "descripcion",
            className: "text-center",
          },
          {
            data: "streamUrl",
            className: "text-center",
          },
          {
            data: "settings",
            className: "text-center",
            searchable: false,
            orderable: false,
          }
        ],
      })

      DatatableChannels.on('click', '.create-epg', function (e) {
        let $tr = $(this).closest('tr')
        if ($($tr).hasClass('child')) $tr = $tr.prev('.parent')
        const channelData = DatatableChannels.row($tr).data()

        $('#input-create-epg-channel').val(channelData._id)
        $('#input-create-epg-channel-nombre').val(channelData.nombre)
        $('#modal-create-epg').modal('show')
      })


      $('#form-create-channel').on('submit', function (e) {
        e.preventDefault()
        const form = $('#form-create-channel')[0]
        const data = new FormData(form)
        $.ajax({
          type: 'post',
          enctype: 'multipart/form-data',
          url: 'http://34.70.3.128/channels',
          data,
          processData: false,
          contentType: false,
          dataType: 'json',
          cache: false,
          success (response) {
            $('#modal-create-channel').modal('hide')
            DatatableChannels.ajax.reload()
            $('#form-create-channel').trigger('reset')
          },
          error (xhr) {
            console.log(xhr)
          },
          complete (xhr, status) {
            console.log(xhr)
            console.log(status)
            
          },
          
        })
      })


      // Categories Scripts
      let DatatableCategories = null
      $(document).ready(function () {
        // Datatable
        DatatableCategories = $("#datatable-categories").DataTable({
          pagingType: "full_numbers",
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
          ],
          responsive: true,
          processing: true,
          serverSide: true,
          language: {
            "sProcessing": "Conectando...",
            "sLengthMenu": "Mostrar _MENU_ categorías",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Resultados del _START_ al _END_ de _TOTAL_",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(de un total de _MAX_ resultados)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sSearchPlaceholder": "",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
              "sFirst": "Primero",
              "sLast": "Último",
              "sNext": "Siguiente",
              "sPrevious": "Anterior"
            },
            "oAria": {
              "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
              "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
          },
          ajax: {
            url: 'http://34.70.3.128/categories/datatable',
            dataSrc (response) {
              for (const category of response.data) {
                category.disponible = `<i class="material-icons ${category.disponible ? 'text-success' : 'text-danger'}">${category.disponible ? 'check_circle' : 'cancel'}</i>`
                category.adultos = `<i class="material-icons ${category.adultos ? 'text-success' : 'text-danger'}">${category.adultos ? 'check_circle' : 'cancel'}</i>`
                category.icono = `<img class="img" src="${category.icono}" width="35">`
              }
              return response.data
            },
          },
          order: [[0, 'asc']],
          columns: [
          {
              data: "orden",
              className: "text-center",
            },
            {
              data: "nombre",
              className: "text-center",
            },
            {
              data: "disponible",
              className: 'text-center',
            },
            {
              data: "adultos",
              className: 'text-center',
            },
            {
              data: "icono",
              className: 'text-center',
            },
          ],
        })
  
      });




      $('#form-create-category').on('submit', function (e) {
        e.preventDefault()
        const form = $('#form-create-category')[0]
        const data = new FormData(form)
        $.ajax({
          type: 'post',
          enctype: 'multipart/form-data',
          url: 'http://34.70.3.128/categories',
          data,
          processData: false,
          contentType: false,
          dataType: 'json',
          cache: false,
          success (response) {
            $('#modal-create-category').modal('hide')
            DatatableCategories.ajax.reload()
            $('#form-create-category').trigger('reset')
          },
          error (xhr) {
            console.log(xhr)
          },
          complete (xhr, status) {
            console.log(xhr)
            console.log(status)
            
          },
          
        })
      })




      // EPG Scripts


      let DatatableEPG = null
      $(document).ready(function () {
        // Datatable
        DatatableEPG = $("#datatable-epg").DataTable({
          pagingType: "full_numbers",
          lengthMenu: [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
          ],
          responsive: true,
          processing: true,
          serverSide: true,
          language: {
            "sProcessing": "Conectando...",
            "sLengthMenu": "Mostrar _MENU_ programas",
            "sZeroRecords": "No se encontraron resultados",
            "sEmptyTable": "Ningún dato disponible en esta tabla",
            "sInfo": "Resultados del _START_ al _END_ de _TOTAL_",
            "sInfoEmpty": "Mostrando registros del 0 al 0 de un total de 0 registros",
            "sInfoFiltered": "(de un total de _MAX_ resultados)",
            "sInfoPostFix": "",
            "sSearch": "Buscar:",
            "sSearchPlaceholder": "",
            "sUrl": "",
            "sInfoThousands": ",",
            "sLoadingRecords": "Cargando...",
            "oPaginate": {
              "sFirst": "Primero",
              "sLast": "Último",
              "sNext": "Siguiente",
              "sPrevious": "Anterior"
            },
            "oAria": {
              "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
              "sSortDescending": ": Activar para ordenar la columna de manera descendente"
            }
          },
          ajax: {
            url: 'http://34.70.3.128/epg/datatable',
            dataSrc (response) {
              for (const category of response.data) {}
              return response.data
            },
          },
          order: [[0, 'asc']],
          columns: [
          {
              data: "channelName",
              className: "text-center text-nowrap",
            },
            {
              data: "timezone",
              className: "text-center text-nowrap",
            },
            {
              data: "titulo",
              className: 'text-center text-nowrap',
            },
            {
              data: "inicio",
              className: 'text-center text-nowrap',
            },
            {
              data: "fin",
              className: 'text-center text-nowrap',
            },
            {
              data: 'duracion',
              className: 'text-center text-nowrap',
            },
            {
              data: 'calificacion',
              className: 'text-center text-nowrap',
            },
            {
              data: 'genero',
              className: 'text-center text-nowrap',
            },
            // {
            //   data: 'episodioTitulo',
            //   className: 'text-center text-nowrap',
            // },
            // {
            //   data: 'temporada',
            //   className: 'text-center text-nowrap',
            // },
            // {
            //   data: 'episodio',
            //   className: 'text-center text-nowrap',
            // },
            // {
            //   data: 'descripcion',
            //   className: 'text-center text-truncate',
            // },
          ],
        })
  
      });



      $('#form-create-epg').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
          type: 'post',
          url: 'http://34.70.3.128/epg',
          data: $('#form-create-epg').serialize(),
          dataType: 'json',
          success (response) {
            $('#modal-create-epg').modal('hide')
            DatatableEPG.ajax.reload()
            $('#form-create-epg').trigger('reset')
          },
          error (xhr) {
            console.log(xhr)
          },
          complete (xhr, status) {
            console.log(xhr)
            console.log(status)
            
          },
        })
      })

    });

  }

}
