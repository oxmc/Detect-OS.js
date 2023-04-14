/*OS-Detect.js Copyright oxmc 2021-2023*/

/* Polly fill for .replaceAll() */
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr){
    // If a regex pattern
    if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
      return this.replace(str, newStr);
    }
    // If a string
    return this.replace(new RegExp(str, 'g'), newStr);
  };
};

/* OS-Detect Function */
async function DetectOS(opts) {
  /*Variables*/
  var useragent = navigator.userAgent;
  var OSNAME = OS = browser = Type = ConsoleType = version = "Unknown";
  var Mobile = IOS = win11detect = "False";
  /* Options */
  var defopts = {
    debug: false
  };
  /* Handle options: */
  if (typeof opts !== "undefined") {
    /* Debug Mode: */
    if (typeof opts.debug !== "undefined") {
      var debug = opts.debug;
    };
  } else {
    var opts = defopts;
  };
  /*Detect if OS is Windows*/
  if (useragent.indexOf("Win") !== -1) {
    if (navigator.appVersion.indexOf("Windows Phone") !== -1) {
      versionstring = useragent.split('Phone')[1].split(";")[0].trim();
      OSNAME = `Windows Phone OS`;
      Type = "WindowsPhone";
    } else {
      versionstring = useragent.split('NT')[1].split(";")[0].trim();
      OSNAME = `Windows OS`;
      Type = "Windows";
    };
    /* Windows 11 fix */
    if (typeof navigator.userAgentData !== "undefined") {
      win11detect = "true";
      try {
        const ua = await navigator.userAgentData.getHighEntropyValues(["platformVersion"]);
        if (navigator.userAgentData.platform === "Windows") {
          var majorPlatformVersion = parseInt(ua.platformVersion.split('.')[0]);
          if (majorPlatformVersion >= 13) {
            versionstring = "11.0";
          };
        };
      } catch (error) {
        console.warn("Unable to detect for windows 11 and later:", error.message);
      }
    } else {
      /* Check if site is using https */
      var protocol = location.protocol === "https:" ? "https" : "http";
      if (protocol === "https") {
        console.warn("Unable to detect for windows 11 and later, browser does not support navigator.userAgentData");
      } else {
        console.warn("Unable to detect for windows 11 and later, navigator.userAgentData requires the page to be hosted over HTTPS which this page is not.");
      };
    };
    switch (versionstring) {
      case "11.0":
        version = "11";
        break;
      case "10.0":
        version = "10";
        break;
      case "6.3":
        version = "8.1";
        break;
      case "6.2":
        version = "8";
        break;
      case "6.1":
        version = "7";
        break;
      case "6.0":
        version = "vista";
        break;
      case "5.2":
      case "5.1":
        version = "XP";
        break;
      case "5.0":
        version = "2000";
        break;
      case "4.0":
        version = "NT 4.0";
        break;
      case "3.51":
        version = "NT 3.51";
        break;
      case "3.5":
        version = "NT 3.5";
        break;
      case "3.1":
        version = "NT 3.1";
        break;
      default:
        version = "unknown";
        break;
    };
  };
  /*Detect if OS is Mac or IOS*/
  if (useragent.indexOf("Mac") !== -1) {
    /*Detect if OS is iPad*/
    if (navigator.appVersion.indexOf("iPad") !== -1) {
      OSNAME = `iPad OS`;
      IOS = "True";
      /*Detect if OS is iPhone*/
    } else if (navigator.appVersion.indexOf("iPhone") !== -1) {
      OSNAME = `iPhone OS`;
      IOS = "True";
      /*Detect if OS is iPod*/
    } else if (navigator.appVersion.indexOf("iPod") !== -1) {
      OSNAME = `iPod OS`;
      IOS = "True";
    } else {
      OSNAME = `Mac OS`;
      Type = "Mac";
      if (navigator.appVersion.indexOf("OS X") !== -1){
        /*Detect MacOS version*/
        version = useragent.split('OS X')[1].split(")")[0].trim().replace('OS X', '').replace(' ', '').split('_').join('.');
      } else if (navigator.appVersion.indexOf("Mac_PowerPC") !== -1){
        version = `9`;
      };
    };
    /*Detect IOS version*/
    if (IOS == "True") {
      Type = "IOS";
      if (navigator.appVersion.indexOf("iPhone;") !== -1 || navigator.appVersion.indexOf("iPad;") !== -1 || navigator.appVersion.indexOf("iPod;") !== -1) {
        version = useragent.split("OS")[1].split("Mac")[0].trim().replace("like", "").replace(" ", "").split("_").join(".");
        IOS = "True";
      } else if (navigator.appVersion.match("iPhone OS") !== -1 || navigator.appVersion.match("iPad OS") !== -1 || navigator.appVersion.match("iPod OS") !== -1) {
        version = useragent.split("OS")[1].split("like")[0].trim().replace("_", ".");
        IOS = "True";
      } else if (navigator.appVersion.indexOf("Version/") != -1) {
        version = useragent.split("Version/")[1].split("Gecko")[0].split("Mobile/")[0].trim();
      };
    };
  };
  /* Remove unix detection temporarily */
  /*Detect if OS is Unix*/
  /*
  if (navigator.appVersion.indexOf("X11") != -1) {
    OSNAME = "Unix OS";
    Type = "Unix";
  };
  */
  /*Detect Blackberry OS*/
  if (useragent.match(/BlackBerry|BB|PlayBook/i)) {
    OSNAME = `BlackBerry OS`;
  };
  /*Detect if OS is Linux or Android*/
  if (navigator.appVersion.indexOf("Linux") != -1) {
    /*Detect if OS is Android*/
    if (/Android/.test(useragent)) {
      version = useragent.split("Android")[1].split(";")[0].trim();
      OSNAME = "Android OS";
      Type = "Android";
    } else {
      OSNAME = "Linux OS";
      Type = "Linux";
    };
  };
  /*Detect if OS is ChromeOS*/
  if (navigator.appVersion.indexOf("CrOS") != -1) {
    OSNAME = "Chrome OS";
    Type = "ChromeOS";
  };
  /*Detect if OS is ubuntu*/
  if (navigator.appVersion.indexOf("ubuntu") != -1) {
    OSNAME = "Ubuntu OS";
    Type = "Ubuntu";
  };
  /* Detect if OS is Playstation */
  if (navigator.appVersion.indexOf("PlayStation") != -1) {
    /* Detect version */
    version = useragent.split('PlayStation')[1].split(".")[0].trim().replace('PlayStation', '').replace(' ', '');
    OSNAME = "PlayStation OS";
    Type = "PlayStation";
  };
  /*Detect if device is mobile*/
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(useragent)) {
    Mobile = "True";
  } else {
    Mobile = "False";
  };
  /* Detect Browser */
  if (useragent.indexOf("U;") > -1) {
    if (useragent.indexOf("Silk/") > -1) {
      browser = `SilkBrowser ${useragent.split('Silk/')[1].split(".")[0].trim()}`;
	} else if (useragent.indexOf("Silk") > -1) {
      browser = `SilkBrowser ${useragent.split('Silk')[1].split(".")[0].trim()}`;
    } else {
      if (useragent.indexOf("UCBrowser/") > -1) {
        browser = `UCBrowser ${useragent.split('UCBrowser/')[1].split(".")[0].trim()}`;
      } else if (useragent.indexOf("UCBrowser") > -1) {
        browser = `UCBrowser ${useragent.split('UCBrowser')[1].split(".")[0].trim()}`;
      };
    };
  } else if (useragent.indexOf("SamsungBrowser/") > -1) {
    browser = `SamsungBrowser ${useragent.split('SamsungBrowser/')[1].split(".")[0].trim()}`;
  } else if (useragent.indexOf("SamsungBrowser") > -1) {
    browser = `SamsungBrowser ${useragent.split('SamsungBrowser')[1].split(".")[0].trim()}`;
  } else if (useragent.indexOf("Opera") > -1 || useragent.indexOf("OPR") > -1) {
    if (useragent.indexOf("Opera/") > -1) {
      browser = `Opera ${useragent.split('Opera/')[1].split(".")[0].trim()}`;
	} else if (useragent.indexOf("Opera") > -1) {
      browser = `Opera ${useragent.split('Opera')[1].split(".")[0].trim()}`;
    } else if (useragent.indexOf("OPR/") > -1) {
      browser = `Opera ${useragent.split('OPR/')[1].split(".")[0].trim()}`;
    } else if (useragent.indexOf("OPR") > -1) {
      browser = `Opera ${useragent.split('OPR')[1].split(".")[0].trim()}`;
	};
  } else if (useragent.indexOf("Firefox/") > -1) {
    browser = `Firefox ${useragent.split('Firefox/')[1].split(".")[0].trim()}`;
  } else if (useragent.indexOf("Firefox") > -1) {
    browser = `Firefox ${useragent.split('Firefox')[1].split(".")[0].trim()}`;
  } else if (useragent.indexOf("trident/") > -1) {
    browser = `Internet Explorer ${useragent.split('trident/')[1].split(".")[0].trim()}`;
  } else if (useragent.indexOf("trident") > -1) {
    browser = `Internet Explorer ${useragent.split('trident')[1].split(".")[0].trim()}`;
  } else if (OSNAME == "PlayStation OS") {
    browser = `PlayStation ${version} Browser`;
    ConsoleType = "PlayStation";
  } else if (useragent.indexOf("Chrome") > -1 || useragent.indexOf("CriOS") > -1) {
    if (useragent.indexOf("Edg") > -1) {
      if (useragent.indexOf("Edg/") > -1) {
        browser = `Edge ${useragent.split('Edg/')[1].split(".")[0].trim()}`;
      } else {
        browser = `Edge (legacy) ${useragent.split('Edge/')[1].split(".")[0].trim()}`;
      };
    } else if (useragent.indexOf("Puffin/") > -1) {
      browser = `Puffin ${useragent.split('Puffin/')[1].split(".")[0].trim()}`;
    /*} else if (useragent.indexOf("CriOS") > -1) {
      browser = `Chrome on IOS ${useragent.split('CriOS')[1].split(".")[0].trim()}`;
    } else if (useragent.indexOf("CrOS") > -1) {
      browser = `Chrome on ChromeOS ${useragent.split('Chrome/')[1].split(".")[0].trim()}`;*/
	} else {
      browser = `Chrome ${useragent.split('Chrome/')[1].split(".")[0].trim()}`;
    };
  } else if (useragent.indexOf("Safari") > -1) {
    browser = `Safari ${useragent.split('Safari/')[1].split(".")[0].trim()}`;
  };
  /*Convert variables to json*/
  OS = {
    "Name": `${OSNAME}`,
    "Browser": `${browser}`,
    "UserAgent": `${useragent}`,
    "Version": `${version}`,
    "IsIOS": `${IOS}`,
    "IsMobile": `${Mobile}`,
    "Type": `${Type}`,
    "win11support": `${win11detect}`
  };
  /*Log info to console if debug = true*/
  if (opts.debug == true) {
    console.info("Debug set to true, printing OS info");
    console.log(`OS: ${OS.Name}\nBrowser: ${OS.Browser}\nUserAgent: ${OS.UserAgent}`);
  };
  /* Return OS */
  return OS;
};
