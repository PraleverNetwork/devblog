

//boot
// console.log(window.location.search)
var params = new URLSearchParams(window.location.search)

// window.addEventListener('popstate', function (event) {
//     getLoadingData();
// });

getLoadingData();

function getLoadingData(){
    var cookie=getCookie("latestLoad");

    if((params.has("id"))){
        document.cookie = "latestLoad="+params.get("id")+";max-age=300";
        location.search = "";
    }
    else if(cookie!=null){
        loadData(cookie)
    }
    else{
        loadData("home");
    }
    listUpdate();
}

function loadData(url){
    var http = new XMLHttpRequest();
    console.log("[PRLDevBlog] Opening "+url);
    var template_url = "source/"+url;
    http.open("GET", template_url)

    http.onloadstart = function(){
        document.getElementById("source").innerText = "Loading...";
    }

    http.onload = function() {
        if(http.status != 200){
            console.log("[PRLDevBlog] Not found");
            loadData("null");
            return;
        }

        var response = http.response

        //body.innerHTML = response
        document.getElementById("source").innerHTML = response;
        // history.pushState(null, document.title, "/?id="+url);
        document.cookie = "latestLoad="+url+";max-age=3600";
        document.title = "LandWar Dev Blog - "+document.getElementById("header").innerText;
        summonShareLink(url);
    }

    try {
        http.send();
    } catch (error) {
        
    }
    

    // document.getElementById("source").innerHTML="<md-block src='source/home'>404</md-block>";
}

// function loadLocale(){
//     console.log("[PRLDevBlog] Collecting Locale...");
//     var locale = navigator.language;
//     console.log("[PRLDevBlog] Detect Language: "+locale);

//     var http = new XMLHttpRequest();
//     var template_url = "/locale/"+locale+".json";
//     console.log(template_url)
//     http.open("GET", template_url)

//     http.onerror = function() {
//         // http.open("GET", "locale/en.json");
//     }

//     http.onload = function(){
//         console.log(http.response)
//         return JSON.parse(http.response);
//     }
// }

function listUpdate(){
    // var locale = loadLocale();
    // console.log(locale);

    console.log("[PRLDevBlog] Collecting items...")

    var http = new XMLHttpRequest();
    var template_url = "list.json";
    http.open("GET", template_url)

    // http.onloadstart = function(){
    //     document.getElementById("list").innerHTML = "Please wait...";
    // }

    http.onload = function() {
        var result = "";

        var response = http.response

        var json = JSON.parse(response);
        
        json.forEach(root => {
            if(root.root != null){
                console.log("[PRLDevBlog] Collected Root: "+root.root);
                var rootTitle = root.title;

                var items = ""
                root.datas.forEach(item => {
                    console.log("[PRLDevBlog] Collected "+rootTitle+" Item: "+item.id);
                    var title = item.title
                    var date = new Date(item.date);
                    var dateString = date.toLocaleString();
                    items += '<div class="item" onclick="menuHide();loadData(\''+item.id+'\')"><h3>'+title+'</h3><div>'+dateString+'</div></div>';
                });

                display = "none";
                displayDirection = ">"
                if(root.root == "landwar"){
                    display = "block";
                    displayDirection = "–"
                } 

                result += '<div class="root">'
                + '<h3  onclick="rootItemDisplay(\''+root.root+'\')"><span id="'+root.root+'-direction">'+displayDirection+'</span> '+rootTitle+'</h3>'
                + '<div class="rootitem" id="'+root.root+'-items" style="display: '+display+';">' + items + '</div></div>'
            }
            else if (root.id != null){
                    console.log("[PRLDevBlog] Collected Top item: "+root.id);
                    var date = new Date(root.date);
                    //TODO 임시
                    var title = root.title
                    var dateString = date.toLocaleString();
                    result += '<div class="item" onclick="menuHide();loadData(\''+root.id+'\')"><h3>'+title+'</h3><div>'+dateString+'</div></div>';
            }
        });

        // json.forEach(item => {
        //     console.log("[PRLDevBlog] Collected item: "+item.id);
        //     var date = new Date(item.date);
        //     var dateString = date.toLocaleString();
        //     result += '<div class="item" onclick="menuHide();loadData(\''+item.id+'\')"><h3>'+item.title+'</h3><div>'+dateString+'</div></div>';
        // });

        document.getElementById("list").innerHTML = result;
        console.log("[PRLDevBlog] Finish collecting data");
    }

    http.send();
}

function summonShareLink(url){
    if(url=="404") return;

    var a = document.getElementById("header");
    a.innerHTML += ' <button onclick="copyURL(\''+url+'\')">공유</button>';
}

function copyURL(url){
    var value = window.location.protocol+"//"+window.location.host+"/?id="+url;
    navigator.clipboard.writeText(value);

    // alert("복사되었습니다! "+value);
}

function menuShow(){
    document.getElementById("menu").style.display = "grid";
    document.getElementById("background").style.display = "block";
}

function menuHide(){
    if(window.innerWidth<800){
        document.getElementById("menu").style.display = "none";
    }
    document.getElementById("background").style.display = "none";
}

function rootItemDisplay(id){
    var direction = document.getElementById(id+'-direction')
    var item = document.getElementById(id+'-items');

    if(item.style.display == "none"){
        item.style.display = "block"
        direction.innerHTML = "–"
    }
    else{
        item.style.display = "none";
        direction.innerHTML = ">"
    }
}

function getCookie(name) {
    var value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return value? value[2] : null;  
}
