$(document).ready(function() {
    var alphabetSearch = '';

    $.fn.dataTable.ext.search.push(function(settings, searchData) {
        if (!alphabetSearch) {
            return true;
        }

        return searchData[0].charAt(0).toUpperCase() === alphabetSearch;
    });

    var table = $('#dataTable').DataTable({
        data: JSON.parse($('#directorydata').text()),
        columns: [{
            data: 'name',
            fnCreatedCell: function(nTd, sData, oData) {
                $(nTd).html("<a href='../" + oData.address + "'>" + oData.name + "</a>");
            }
        }],
        pageLength: 25
    });

    var alphabet = $('<div class="alphabet"/>');

    $('<span class="active"/>')
        .data('letter', '')
        .html('All')
        .appendTo(alphabet);

    for (var i = 0; i < 26; i++) {
        var letter = String.fromCharCode(65 + i);

        $('<span/>')
            .data('letter', letter)
            .html(letter)
            .appendTo(alphabet);
    }

    alphabet.insertBefore(table.table().container());

    alphabet.on('click', 'span', function() {
        alphabet.find('.active').removeClass('active');
        $(this).addClass('active');

        alphabetSearch = $(this).data('letter');
        table.draw();
    });
});
