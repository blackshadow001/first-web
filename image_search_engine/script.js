const imagesWrapper = document.querySelector(".images")
const loadMoreBtn = document.querySelector(".load-more")
const searchInput = document.querySelector(".search-box input")
const lightBox = document.querySelector(".lightbox")
const closeBtn = lightBox.querySelector(".uil-times")
const downloadImgBtn = lightBox.querySelector(".uil-import")

const apiKey = "1p9K61a7WpSukh1JFvWcAMVAKOMSitfWV1nuVfWnHp8iWNvgVXXErtua"
const perPage = 15;
let currentPage = 1;
let searchTerm = null;

const downloadImg = (imgURL) => {
    //converting img into blob, creating download link & downloading it
    fetch(imgURL).then(res => res.blob()).then(file =>{
        const a = document.createElement("a")
        a.href = URL.createObjectURL(file)
        a.download = new Date().getTime()
        a.click();
    }).catch(() => alert("Failed to download image!"))
}

const showLightBox = (name, img) => {
    // showing lightbox  & setting img source ,name and button attribute
    lightBox.querySelector("img").src =img;
    lightBox.querySelector("span").innerText =name;
    downloadImgBtn.setAttribute("data-img",img)
    lightBox.classList.add("show")
    document.body.style.overflow = "hidden";
}

const hideLightbox = () => {
    lightBox.classList.remove("show")
    document.body.style.overflow = "auto";
}

const generateHTML = (images) => {
    //making li of all fetched images and adding them to the existing image wraper
    imagesWrapper.innerHTML += images.map(img =>
        `<li class="card" onclick = "showLightBox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="img">
                <div class="details">
                    <div class="photographer">
                        <i class="uil uil-camera"></i>
                        <span>${img.photographer}</span>
                    </div>
                     <button onClick = "downloadImg('${img.src.large2x}');event.stopPropogation();">
                        <i class="uil uil-import"></i>
                     </button>
                </div>
         </li>`
        ).join("");
}

const getImages = (apiURL) => {
    //fetching images by API with authorization header
    loadMoreBtn.innerText = "Loading..."
    loadMoreBtn.classList.add("disabled")
    fetch(apiURL,{
       headers: {Authorization: apiKey} 
    }).then(res => res.json()).then(data =>{
        generateHTML(data.photos);
        loadMoreBtn.innerText = "Load More"
        loadMoreBtn.classList.remove("disabled")
    }).catch(() => alert("Failed to load images!..."))
}

const loadMoreImages = () => {
    currentPage++;
    let apiURL =`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL =searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL; 
    getImages(apiURL);
}

const loadSearchImages = (e) => {
    if(e.target.value === "") return searchTerm = null;
    //if key is pressed it updates the current page
    if(e.key === "Enter"){
        currentPage = 1;
        searchTerm = e.target.value;
        imagesWrapper.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`);
    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`)
loadMoreBtn.addEventListener("click",loadMoreImages)
searchInput.addEventListener("keyup",loadSearchImages)
closeBtn.addEventListener("click",hideLightbox)
downloadImgBtn.addEventListener("click",(e) => downloadImg(e.target.dataset.img));