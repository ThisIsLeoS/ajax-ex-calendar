/* DESCRIZIONE EX:
trovate la descrizione  e tutto il resto qui: https://docs.google.com/document/d/1OcSGrT3Snh_DXrDZ82DVY59eqvzNb_Nh_Db5z3qq2_k/edit */

// @ts-check

for (var i = 1; i <= 12; ++i) {
    var monthEl = createMonth(i);
    $("main .calendar > .year-2018").append(monthEl);
}

// January is the first month visible in the page
$("main .calendar > .year-2018 > .gen").addClass("current-month");

/**
 * Returns the month element corresponding to the month number passed as input
 * @param {Number} monthNum - A month number (between 1 and 12) whose corresponding month element
 *     will be returned
 */
function createMonth(monthNum) {

    // the month element is created from the month template
    var templateCompiled = Handlebars.compile($("#month-template").html());
    var templateHTML = templateCompiled({

        // month name with format "MMM" (jan, feb etc.)
        "month": moment().month(monthNum - 1).format("MMM")
    });
    var monthElement = $(templateHTML);

    // the list element containing the dates of the month passed as input is created
    var datesOl = createDatesOl(monthNum);

    // the list element is appended to the month element
    monthElement.append(datesOl);

    return monthElement;
}

/**
 * Returns an <ol> containing the dates of the month passed as input
 * @param {Number} monthNum - A month number (between 1 and 12)
 * @returns an <ol> containing the dates of the month passed as input
 */
function createDatesOl(monthNum) {
    var datesOl = $("<ol>");

    /* this for loop will iterate a number of times equal to the number of days in the month passed
    as input (31 times for ianuary, 28 times for February etc.) */
    for (var i = 1; i <= moment().month(monthNum - 1).daysInMonth(); ++i) {

        // the date element is created from the date template
        var templateCompiled = Handlebars.compile($("#date-template").html());
        var templateHTML = templateCompiled({
            "date": moment(i + "/" + monthNum + "/2018", "D/M/YYYY").format("YYYY-MM-DD"),
            "date-day": i,
            "date-month": moment().month(monthNum - 1).format("MMMM")
        });
        var dateElement = $(templateHTML);

        // addFestivity is called
        addFestivity(dateElement, monthNum);

        // the date element is appended to the previously created <ol>
        datesOl.append(dateElement);
    }
    return datesOl;
}

/**
 * If the date of the date element passed as input is a festivity:
 * - puts the corresponding festivity name element after the last child of the date element
 * - adds the festivity-day class to the date element
 * @param {Object} dateElement - The dateElement whose date will be checked to see wether it's a
 *     festivity or not
 * @param {Number} monthNum - The number of the date element's month (between 1 and 12)
 */
function addFestivity(dateElement, monthNum) {
    $.ajax({
        "url": "https://flynn.boolean.careers/exercises/api/holidays",
        "method": "GET",
        "data": {
            "year": 2018,
            "month": monthNum - 1
        },
        "success": function(data) {

            /* note: if the data.response array is empty (no festivities in that month), the
            next for loop won't loop */
            for (var i = 0; i < data.response.length; ++i) {

                // if the date is a festivity
                if (data.response[i].date === dateElement.data("date")) {

                    // the festivity name element is created from the festivity name template
                    var templateCompiled = Handlebars.compile($("#festivity-name-template").html());
                    var templateHTML = templateCompiled({
                        "festivity": data.response[i].name
                    });

                    // the festivity name element is put after the last child of the date element
                    dateElement.children(":last-child").after(templateHTML);

                    // the festivity-day class is added to the date element
                    dateElement.addClass("festivity-day");
                }
            }
        },
        "error": function (iqXHR, textStatus, errorThrown) {
            alert(
                "iqXHR.status: " + iqXHR.status + "\n" +
                "textStatus: " + textStatus + "\n" +
                "errorThrown: " + errorThrown
            );
        }
    });
}
