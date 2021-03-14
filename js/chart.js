var dict = {'newAnime': 'table1', 'ongoingAnime': 'table2', 'movieSongs': 'table3', 'specialSongs': 'table4', 'insertSongs': 'table5'}
var revDict = {'table1': 'newAnime', 'table2': 'ongoingAnime', 'table3': 'movieSongs', 'table4': 'specialSongs', 'table5': 'insertSongs'}

reloadTable('');

var searchQuery = '';

$(".show").change(function() {
    if($(this).is(':checked') && ($('#' + dict[this.value] + " tr").length > 1)){
        $('#' + dict[this.value]).show();
    } else {
        $('#' + dict[this.value]).hide();
    }
});

$("#showonly").change(function() {
    var showType = $("#showonly").children("option:selected").val();
    for(var key in dict) {
        formatTable(obj[key], dict[key], searchQuery)
    }
});

$("#exactMatch").change(function() {
    if ($("#exactMatch").is(':checked') && (window.location.href.indexOf("anime") >= 0 || window.location.href.indexOf("artist") >= 0 )) {
        pageTitle = $("h1").text();
        reloadTable(pageTitle)
    } else {
        reloadTable('')
    }
});


$("#displayType").change(function() {
    var disyplayType = $(this).children("option:selected").val();
    var selectedYear = $("#year").children("option:selected").val();
    if (selectedYear == 'All') {
        searchQuery = 'SearchEverything';
    }
    for(var key in dict) {
        formatTable(obj[key], dict[key], searchQuery)
    }
});

var obj;
function reloadTable(search) {
    if($(".data").length == 0) {
        try {
            $('.filter-button').hide();
		} catch(err) {
        }
    } else {
        var text = ($('.data').text());
        obj = JSON.parse(text);
        for(var key in dict) {
            formatTable(obj[key], dict[key], search);
        }
    }
}

function formatTable(fullData, tableName, search) {
    var showType = $("#showonly").children("option:selected").val();
    var tableData = [];
    var filteredData = [];
    if (showType == 'All') {
        tableData = fullData;
    } else {
        if (typeof fullData !== "undefined") {
            fullData.forEach(function(data) {
                cols = Math.min(data.length, 5)
                if (data[[cols - 3]] == showType) {
                    tableData.push(data);
                }
            });
        }
    }
    if (search != '') {
        if (typeof tableData !== "undefined") {
            tableData.forEach(function(data) {
                cols = data.length;
                animeName = data[[0]];
                songName = data[[cols - 3]];
                artistName = data[[cols - 2]];
                /* removing names from unrelated searches */
                if (window.location.href.indexOf("anime") < 0) {
                    animeName = ''
                }
                if (window.location.href.indexOf("artist") < 0) {
                    console.log("Clearing Name");
                    console.log(artistName);
                    console.log(window.location.href.indexOf("artist"));
                    console.log(window.location.href.indexOf("artist") < 0))
                    artistName = ''
                }
                songName = ''

                if ($("#exactMatch").is(':checked')) {
                    console.log(data);
                    console.log(artistName);
                    console.log(search);
                    if (songName.toUpperCase() == search.toUpperCase() || animeName.toUpperCase() == search.toUpperCase() || artistName.toUpperCase() == search.toUpperCase()) {
                        filteredData.push(data);
                    }
                } else {
                    if (songName.toUpperCase().includes(search.toUpperCase()) || animeName.toUpperCase().includes(search.toUpperCase()) || artistName.toUpperCase().includes(search.toUpperCase()) || checkReverseNames(artistName, search)) {
                        filteredData.push(data);
                    } else if (search == "SearchEverything") {
                        filteredData.push(data);
                    }
                }
            });
            tableData = filteredData;
        }
    }

    var content = '';

    var displayType = $("#displayType").children("option:selected").val();
    if (displayType == 'normal') {
        content += styleNormalTable(tableData, tableName, search);
    } else if (displayType == 'simple') {
        content += styleSimpleTable(tableData, tableName, search);
    }

    $('.' + tableName).remove();
    createTableHead(tableName, displayType);
    if (tableData && tableData.length > 0) {
        $('#' + tableName).append(content);
        if ($('#' + revDict[tableName]).is(":checked")){
            $('#' + tableName).show();
        } else {
            $('#' + tableName).hide();
        }
    } else {
        $('#' + tableName).hide();
    }

}

function checkReverseNames(artistName, search) {
    artistName = artistName.toUpperCase();
    search = search.replace(/\s{2,}/g, ' ');
    searches = search.toUpperCase().split(' ');
    var i = 0
    if (typeof searches !== "undefined") {
        searches.forEach(function(data){
            if (artistName.includes(data)) {
                i++;
            }
        });
    }
    if (i >= searches.length) {
        return true;
    }
    return false;
}

function escapeHtml(string) {
    return String(string).replace(/[<>\/]/g, function (s) {
        if (s == '<') {
            return '&lt;';
        } else if (s == '>') {
            return '&gt;';
        } else {
            return s;
        }
    });
}

function styleNormalTable(tableData, tableName, search) {
    content = ''
    var i = 0;
    var previous = [0, 0, 0, 0, 0];
    if (typeof tableData !== "undefined") {
        tableData.forEach(function(data){
            if (previous[0] == 0) {
                content += "<tbody class='" + tableName + "'>";
            }
            cols = Math.min(data.length, 5)
            content += "<tr>";
            content += formatEntry(i, tableData, previous, 0);
            if (tableName == 'table4' || tableName == 'table5') {
                content += "<td>" + data[1] + "</td>";
            }
            content += "<td><span class='" + data[cols - 3] + "'>" + data[cols - 3] + "</span></td>"
            content += formatEntry(i, tableData, previous, cols - 1);
            content += formatEntry(i, tableData, previous, cols - 2);
            content += "</tr>";
            if (previous[0] == 0) {
                content += "</tdbody>";
                previous = [0, 0, 0, 0, 0];
            }
            i++;
        });
    }
    return content;
}

function styleSimpleTable(tableData, tableName, search) {
    content = '';
    var i = 0;
    var previous = [0];
    var types = [];
    if (typeof tableData !== "undefined") {
        tableData.forEach(function(data){
            if (previous[0] == 0) {
                content += "<tbody class='" + tableName + "'>";
                rowSpan = getOccurrencess(i, tableData, 0);
                if (rowSpan > 1) {
                    previous[0] = rowSpan - 1;
                }
            } else {
                previous[0] = previous[0] - 1;
            }
            cols = Math.min(data.length, 5)
            content += "<tr>";

            var type = data[cols - 3];
            types.push(type);
            var opNumber = countInArray(type, types);

            // anime name
            if (tableName == 'table1' || tableName == 'table2') {
                content += "<td>" + escapeHtml(data[0]) + " " + type + data[1] + "</td>";
            } else if (tableName == 'table4') {
                content += "<td>" + escapeHtml(data[0]) + " EP " + data[1] + " " + type + "</td>";
            } else if (tableName == 'table5') {
                if (data[1].includes(",") || data[1].includes("-")) {
                    content += "<td>" + escapeHtml(data[0]) + " (EPs " + data[1] + ")</td>";
                } else {
                    content += "<td>" + escapeHtml(data[0]) + " (EP " + data[1] + ")</td>";
                }
            } else {
                content += "<td>" + escapeHtml(data[0]) + " " + type + "</td>";
            }

            // song and aritst
            if (data[cols - 2] == '' && data[cols - 1] == '') {
                content += '<td></td>';
            } else {
                content += '<td>"' + escapeHtml(data[cols - 2]) + '" by ' + escapeHtml(data[cols - 1]) + '</td>';
            }

            content += "</tr>";
            if (previous[0] == 0) {
                content += "</tdbody>";
                previous = [0, 0, 0, 0, 0];
                types = [];
            }
            i++;
        });
    }
    return content;
}

function formatEntry(i, data, previous, pos) {
    content = "";
    if (previous[pos] == 0) {
        rowSpan = getOccurrencess(i, data, pos);
        if (rowSpan > 1) { // ideally should check previous3 first
            content += "<td rowspan='" + rowSpan + "'>" + escapeHtml(data[i][pos]) + "</td>";
            previous[pos] = rowSpan - 1;
        } else {
            content += "<td>" + escapeHtml(data[i][pos]) + "</td>";
        }
    } else {
        content += "<td class='emptytd'></td>";
        previous[pos] = previous[pos] - 1;
    }
    return content;
}

function getOccurrencess(i, data, pos) {
    occurrences = 1;
    if (i + 1 < data.length) {
        while ((data[i][pos] == data[i+1][pos]) && data[i][pos] != "") {
            occurrences++;
            i++;
            if (i + 1 >= data.length) {
                break;
            }
        }
    }
    return occurrences;
}

function countInArray(search, array) {
    var count = array.reduce(function(n, val) {
        return n + (val === search);
    }, 0);
    return count;
}

function createTableHead(tableName, displayType) {
    content = '';
    content += '<thead class="' + tableName + '">';
    content += '<tr>';
    var rowNames = {'head0': '', 'head1': '', 'head2': '', 'head3': '', 'head4': ''};
    var tableNames = [];
    if (displayType == 'normal') {
        switch (tableName) {
            case 'table1':
                tableNames.push('Anime', 'Type', 'Artist', 'Song');
                break;
            case 'table2':
                tableNames.push('Ongoing Anime', 'Type', 'Artist', 'Song');
                break;
            case 'table3':
                tableNames.push('Movies / OVAs', 'Type', 'Artist', 'Song');
                break;
            case 'table4':
                tableNames.push('Single Episode Songs', 'Ep', 'Type', 'Artist', 'Song');
                break;
            case 'table5':
                tableNames.push('Insert Songs', 'Ep', 'Type', 'Artist', 'Song');
        }
    } else if (displayType == 'simple') {
        switch (tableName) {
            case 'table1':
                tableNames.push('Anime', 'Song & Artist');
                break;
            case 'table2':
                tableNames.push('Ongoing Anime', 'Song & Artist');
                break;
            case 'table3':
                tableNames.push('Movies / OVAs', 'Song & Artist');
                break;
            case 'table4':
                tableNames.push('Single Episode Songs', 'Song & Artist');
                break;
            case 'table5':
                tableNames.push('Insert Songs', 'Song & Artist');
        }
    }

    var i = 0;
    for(i = 0; i < tableNames.length; i++) {
        rowNames['head' + i] = tableNames[i];
    }
    for(var key in rowNames) {
        if(rowNames[key] != '') {
            content += '<td>' + rowNames[key] + '</td>';
        }
    }
    content += '</tr>';
    $('#' + tableName).append(content);
}

function collapseTopNav() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}

function showFilters() {
    $('.filters').slideToggle();
}
