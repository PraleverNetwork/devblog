

//boot
// console.log(window.location.search)
var params = new URLSearchParams(window.location.search)

// window.addEventListener('popstate', function (event) {
//     getLoadingData();
// });

getLoadingData();

function getLoadingData(){
    if(params.has("id")){
        loadData(params.get("id"));
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

    http.onprogress = function(){
        //document.getElementById("source").innerHTML = "loading...";
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
        document.title = "LandWar DevLog - "+document.getElementById("header").innerText;
        summonShareLink(url);
    }

    try {
        http.send();
    } catch (error) {
        
    }
    

    // document.getElementById("source").innerHTML="<md-block src='source/home'>404</md-block>";
}

function listUpdate(){
    console.log("[PRLDevBlog] Collecting items...")

    var http = new XMLHttpRequest();
    var template_url = "list.json";
    http.open("GET", template_url)

    http.onprogress = function(){
        document.getElementById("list").innerHTML = "Please wait...";
    }

    http.onload = function() {
        var result = "";

        var response = http.response

        var json = JSON.parse(response);
        
        json.forEach(root => {
            if(root.root != null){
                console.log("[PRLDevBlog] Collected Root: "+root.root);
                var rootTitle = root.root;

                var items = ""
                root.datas.forEach(item => {
                    console.log("[PRLDevBlog] Collected "+rootTitle+" Item: "+item.id);
                    var title = item.id
                    var date = new Date(item.date);
                    var dateString = date.toLocaleString();
                    items += '<div class="item" onclick="menuHide();loadData(\''+item.id+'\')"><h3>'+title+'</h3><div>'+dateString+'</div></div>';
                });

                result += '<div class="root">'
                + '<h3  onclick="rootItemDisplay(\''+root.root+'\')"><span id="'+root.root+'-direction">></span> '+root.root+'</h3>'
                + '<div class="rootitem" id="'+root.root+'-items" style="display: none;">' + items + '</div></div>'
            }
            else if (root.id != null){
                    console.log("[PRLDevBlog] Collected Top item: "+root.id);
                    var date = new Date(root.date);
                    //TODO 임시
                    var title = root.id
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

    alert("복사되었습니다! "+value);
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