/* DESCRIZIONE EX:
trovate la descrizione  e tutto il resto qui: https://docs.google.com/document/d/1OcSGrT3Snh_DXrDZ82DVY59eqvzNb_Nh_Db5z3qq2_k/edit */

$.ajax({
    "url": "https://flynn.boolean.careers/exercises/api/holidays?year=2018&month=0",
    "method": "GET",

    /* if the HTTP request succeded, the days of January 2018 are printed with the format: <day 
    number> <name of the month>, with the festivities styled differently */
    "success": function(data) {
        var i,
            j,
            ithDayDate,
            templateSource,
            templateCompiled,
            janUl;

        // a <ul> is appendend to the ".calendar > .2018 > .january" element...
        $("main .calendar .2018 > .january").html("<ul></ul>");
        // ... and stored into a variable
        janUl = $("main .calendar .2018 > .january > ul");

        // while i <= number of days in January
        for (i = 1; i <= moment("01", "MM").daysInMonth(); ++i) {
            // YYYY-MM-DD date where the day corresponds to the ith iteration of the loop
            ithDayDate = moment(i + "/01/2018", "D/MM/YYYY").format("YYYY-MM-DD");

            // handlebars' template creation
            templateSource = $("#date-template").html();
            templateCompiled = Handlebars.compile(templateSource);
            templateFinal = templateCompiled({
                "date": ithDayDate,
                "day": i,
                "month": "gennaio"
            });

            // the template is appended to the previously created <ul>
            janUl.append(templateFinal);

            /* note: if the data.response array is empty (no festivities in that month), the next
            for loop won't loop */
            for (j = 0; j < data.response.length; ++j) {

                // if the ithDayDate is a festivity
                if (data.response[j].date === ithDayDate) {
                    // handlebars' template creation
                    templateSource = $("#festivity-name-template").html();
                    templateCompiled = Handlebars.compile(templateSource);
                    templateFinal = templateCompiled({"festivity": data.response[j].name});

                    $(".2018 > .january > ul > li[data-date=\"" + ithDayDate + "\"]")
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
