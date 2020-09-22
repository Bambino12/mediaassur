/// ================= Add specific number to date by param Y = year, M=Month, D=Days, H=Hours
Date.prototype.add = function (offset=1, offsetType="Y") {
    let oldDate = new Date(this);
    var year = parseInt(oldDate.getFullYear());
    var month = parseInt(oldDate.getMonth());
    var date = parseInt(oldDate.getDate());
    var hour = parseInt(oldDate.getHours());

    var newDate;

    switch (offsetType) {
    case "Y":
    case "y":
        newDate = new Date(year + offset, month, date, hour);
    break;

    case "M":
    case "m":
        let yearOffset = 0;
        let monthOffset = 0;
        if (offset>0 && offset <12)
        {
        yearOffset = Math.floor((month + offset)/12);
        monthOffset = (month + offset)%12;
        }
        else
        {
        yearOffset = (offset >0 ? Math.floor(offset/12) :  Math.ceil(offset/12));
        monthOffset = month%12 + offset%12;
        }
        newDate = new Date(year + yearOffset, monthOffset, date, hour);
    break;


    case "D":
    case "d":
        let o = oldDate.getTime();
        let n = o + offset * 24 * 3600 * 1000;
        newDate = new Date(n);
    break;

    case "H":
    case "h":
        let o2 = oldDate.getTime();
        let n2 = o2 + offset * 3600 * 1000;
        newDate = new Date(n2);
    break;
    default:
       newDate = new Date(year + offset, month, date, hour);
    }

    return newDate;

  }

  // ============= Add years to specific Date
  Date.prototype.addYears = function(offset=1){
    return new Date(this).add(offset, "Y");
 }

 // ============= Add Month to specific Date
 Date.prototype.addMonths = function(offset=1){
    return new Date(this).add(offset, "M");
 }

 // ============= Add Days to specific Date
  Date.prototype.addDays = function(offset=1){
     return new Date(this).add(offset, "D");
  }

  // ============= Add Hours to specific Date
  Date.prototype.addHours = function(offset=1){
    return new Date(this).add(offset, "H");
 }

/// ================= Difference between two date
Date.prototype.diff = function(date = new Date()){

    let fisrtdate = new Date(this);
    let secondDate = new Date(date);

    if(fisrtdate.getTime() > secondDate.getTime()){
       let change = fisrtdate;
       fisrtdate =  secondDate;
       secondDate = change;
    }

   var difdt = new Date(secondDate - fisrtdate);
   let year = (difdt.toISOString().slice(0, 4) - 1970);
   let month = year * 12 +  difdt.getMonth();
   let days = Math.floor(difdt.getTime() / (1000 * 3600 * 24));

   return {
       y : year,
       m :  month,
       d :  days
   }

  // console.log((difdt.toISOString().slice(0, 4) - 1970) + "Y " + (difdt.getMonth()) + "M " + difdt.getDate() + "D");
}

/// ================= get Date instance from Date
Date.prototype.toDate = function(){
    return this;
}

/// ================= get String from given date by param
Date.prototype.toString = function(withhour=false, lang="FR"){
    let format = "fr-FR";

    switch(lang){
        case "fr":
        case "FR" :
          format = "fr-FR";
        break;

        case "en":
        case "EN" :
         format = "en-EN";
        break;

    }

    if(!withhour){
        return this.toLocaleDateString(format)
    }else{
        return this.toLocaleString(format)
    }

}

/// ================= get mille separator on given number
Number.prototype.sep = function(b){
        let a = '' + this;
        b = b || ' ';
        var c = '',
            d = 0;
        while (a.match(/^0[0-9]/)) {
          a = a.substr(1);
        }
        for (var i = a.length-1; i >= 0; i--) {
          c = (d !== 0 && d % 3 === 0) ? a[i] + b + c : a[i] + c;
          d++;
        }
        return c;
}

/// ================= get mille separator on given string
String.prototype.sep = function(b){

    try{
        let a = '' + this;
        b = b || ' ';
        var c = '',
            d = 0;
        while (a.match(/^0[0-9]/)) {
        a = a.substr(1);
        }
        for (var i = a.length-1; i >= 0; i--) {
        c = (d !== 0 && d % 3 === 0) ? a[i] + b + c : a[i] + c;
        d++;
        }
        return c;
    }catch(error){
      return null;
    }

}

/// ================= get Date instance from String
String.prototype.toDate = function(hour="00:00", lang="FR"){

    try{

        let date = this;

        switch(lang){
            case "fr":
            case "FR":
                var T = date.split("/")
                if(T.length === 3){
                    date = T[2] + "-" + T[1] + "-" + T[0];
                    date += "T"+ hour +":00.0Z"
                }
                break;
        }
        console.log(date);
        return new Date(date);
    }catch(err){
        return null
    }
}

// ============= Add Days to specific String ISO Date
String.prototype.addDays = function(offset=1){
    return new Date(this).add(offset, "D");
 }

/*
String.prototype.toDate = function(hour="00:00", lang="FR"){

    try{

        let date = this;

        switch(lang){
            case "fr":
            case "FR" :
            var T = date.split("/")
            date = T[2] + "-" + T[1] + "-" + T[0];
            break;

        }

        date += "T"+ hour +":00.0Z"
        console.log(date)
       return new Date(date);

    }catch(err){
        return null
    }

}
*/
/// ================= get url parameter
String.prototype.getUrlParams = function(param){
    try{
        console.log(this.toString())
        const urlParams = new URLSearchParams(this.toString().toLowerCase());
        return urlParams.get(param.toLowerCase());
    }catch(error){
        return null;
    }

}