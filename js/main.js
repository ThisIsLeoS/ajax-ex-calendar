/* DESCRIZIONE EX:
trovate la descrizione  e tutto il resto qui: https://docs.google.com/document/d/1OcSGrT3Snh_DXrDZ82DVY59eqvzNb_Nh_Db5z3qq2_k/edit */

/*
 * the calendar's months are generated and appended
 */
var i;
var templateSource, templateCompiled, templateFinal;
var yearElement = $("main .calendar > .year-2018");
var momentObj = moment();

for (i = 0; i < 12; ++i) {

    // handlebars' template creation
    templateSource = $("#month-template").html();
    templateCompiled = Handlebars.compile(templateSource);
    templateFinal = templateCompiled({

        // month with format "MMM" (jan, feb etc.)
        "month": momentObj.month(i).format("MMM")
    });

    yearElement.append(templateFinal);
}

// the first current month is january
$("main .calendar > .year-2018 > .jan").addClass("current-month");

/*
 * the days of every month of the calendar are generated and appended
 */
for (i = 0; i < 12; ++i) generateDaysOfMonth(i);

function generateDaysOfMonth(monthNum) {
    $.ajax({
        "url": "https://flynn.boolean.careers/exercises/api/holidays",
        "method": "GET",
        "data": {
            "year": 2018,
            "month": monthNum
        },

        /*
         * if the HTTP request succeded, the days of the month passed as input are printed with the
         * format: <day number> <name of the month>, with the festivities styled differently
         */
        "success": function(data) {
            var i,
                j,
                ithDayDate,
                templateSource,
                templateCompiled,
                month,
                monthol;

            // a <ol> is appendend to the appropriate month element...
            month =
                $("main .calendar .year-2018 > ." + momentObj.month(monthNum).format("MMM"));
            month.html("<ol></ol>");
            // ... and stored into a variable
            monthol = month.children("ol");

            // while i <= number of days in the month passed as input
            for (i = 1; i <= momentObj.month(monthNum).daysInMonth(); ++i) {

                // date where the day corresponds to the ith iteration of the loop
                ithDayDate = moment(i + "/" + (monthNum + 1) + "/2018", "D/M/YYYY").format("YYYY-MM-DD");

                // handlebars' template creation
                templateSource = $("#date-template").html();
                templateCompiled = Handlebars.compile(templateSource);
                templateFinal = templateCompiled({
                    "date": ithDayDate,
                    "day": i,
                    "month": momentObj.month(monthNum).format("MMMM")
                });

                // the template is appended to the previously created <ol>
                monthol.append(templateFinal);

                /* note: if the data.response array is empty (no festivities in that month), the
                next for loop won't loop */
                for (j = 0; j < data.response.length; ++j) {

                    // if the ithDayDate is a festivity
                    if (data.response[j].date === ithDayDate) {

                        // handlebars' template creation
                        templateSource = $("#festivity-name-template").html();
                        templateCompiled = Handlebars.compile(templateSource);
                        templateFinal = templateCompiled({"festivity": data.response[j].name});

                        $(".year-2018 > ." + momentObj.month(monthNum).format("MMM") + " > ol > li[data-date=\"" + ithDayDate + "\"]")
                            .addClass("festivity-day").append(templateFinal);
                    }
                }
            }
        },
        "error": function (jqXHR, textStatus, errorThrown) {
            alert(
                "jqXHR.status: " + jqXHR.status + "\n" +
                "textStatus: " + textStatus + "\n" +
                "errorThrown: " + errorThrown
            );
        }
    });
}
