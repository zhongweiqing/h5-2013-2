//获取当前地址栏中的参数信息
var search = location.search
    //获取大盒子对象
var bbox = document.querySelector(".mian")
var dt;
//判断当前search对象中是否有值
if (search) {
    //分割search字符串
    var id = search.split('=')[1];

    (async function() {
        var dt = await promiseAjax({
                url: '../php/Detail.php',
                data: 'id=' + id,
                datatype: 'json'
            })
            //创建拼接所有内容的字符串
        var str = `
        <div class="mian">
        <div class="common mian-inner">
            <div id="img-left">
                <div id="small" code="1">
                    <!-- 小图片所在的盒子 -->
                    <img class="picter" src="${dt.imgUrl}" alt="" style="width: 400px; height: 400px;" />
                    <div id="mask"></div>
                    <!-- 遮罩层:175*175 -->
                </div>
                <div id="big">
                    <!-- 大图片所在的盒子:450*450 -->
                    <img id="bigImg" src="${dt.imgUrl}" alt="" id="bigImg" />
                </div>
            </div>
            <div class="mian-right">
                <h2>${dt.title}</h2>
                <p class="sale-desc">${dt.hot}</p>
                <p class="company-info"></p>
                <div class="price-info">
                    <span>${dt.price}元</span>
                </div>
                <!--  -->
                <div data-v-101 class="line"></div>
                <!--  -->
                <div class="buy-option">
                    <div class="buy-box-child">
                        <div data-v-105 class="title">选择版本</div>
                        <ul class="clearfix">
                            <li data-v-110="110" class="active">
                                <a data-v-110 href="javascript:void(0)">6GB+128GB</a>
                            </li>
                            <li data-v-110="111">
                                <a href="javascript:void(0)">8GB+128GB</a>
                            </li>
                            <li data-v-110="112">
                                <a href="javascript:void(0)">8GB+256GB</a>
                            </li>
                        </ul>
                    </div>
                    <div class="buy-box-child">
                        <div data-v-105 class="title">选择颜色</div>
                        <ul class="clearfix">
                            <li data-v-110="113" class="active">
                                <a data-v-110 href="javascript:void(0)">流影紫</a>
                            </li>
                            <li data-v-110="114">
                                <a href="javascript:void(0)">云墨灰</a>
                            </li>
                            <li data-v-110="115">
                                <a href="javascript:void(0)">青山外</a>
                            </li>
                        </ul>
                    </div>

                </div>
                <!--  -->
                <div class="selected-list">
                    <ul>
                        <li data-v-120>

                            <span data-v-title="130"></span>
                            <i data-y>元</i><span data-v-121>${dt.price}</span>
                        </li>
                    </ul>
                    <div class="total-price">总计:${dt.price}元</div>
                </div>
                <!--  -->
                <div class="btn-box">
                    <div class="sale-btn">
                        <a href="#" class="btn-primar">加入购物车</a>
                    </div>
                    <div class="sale-btn">
                        <a href="#" class="btn-orders">立即下单</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
        `
            //把当前内容添加到大盒子中
        bbox.innerHTML = str;
        var smallBox = $id('small'); //小盒子
        var bigBox = $id('big'); //大盒子
        var mask = $id('mask'); //遮罩层
        var box = $id('img-left'); //总容器
        var bigImg = $id('bigImg'); //大图片
        //1.鼠标移入small,big显示,mask显示
        smallBox.onmouseenter = function() {
                bigBox.style.display = "block";
                mask.style.display = "block";
            }
            //2 mask跟着鼠标移动，鼠标在mask中心位置
        smallBox.onmousemove = function(e) {
                e = e || window.event;
                //求出鼠标距离small的距离
                var left = e.clientX + getScroll().left - box.offsetLeft;
                var top = e.clientY + getScroll().top - box.offsetTop;
                //鼠标再mask中心，减去mask宽高的一半
                left = left - mask.offsetWidth / 2;
                top = top - mask.offsetHeight / 2;
                //边界监测
                if (left < 0) {
                    left = 0
                }
                if (left > smallBox.offsetWidth - mask.offsetWidth) {
                    left = smallBox.offsetWidth - mask.offsetWidth;
                }
                if (top < 0) {
                    top = 0;
                }
                if (top > smallBox.offsetHeight - mask.offsetHeight) {
                    top = smallBox.offsetHeight - mask.offsetHeight;
                }
                //定位mask
                mask.style.left = left + "px";
                mask.style.top = top + "px";
                // 3 mask对应的大图位置显示
                // left/350 = 大图左移的距离/800
                // top/350 = 大图上移的距离/800
                var x = left / smallBox.offsetWidth * bigImg.offsetWidth;
                var y = top / smallBox.offsetHeight * bigImg.offsetHeight;

                bigImg.style.marginLeft = -x + "px";
                bigImg.style.marginTop = -y + "px";
            }
            //4 鼠标移出small,big隐藏,mask隐藏
        smallBox.onmouseleave = function() {
            bigBox.style.display = "none";
            mask.style.display = "none";
        }
    })()

} else {
    alert("你还没选中商品")
    location = "../html/list.html"
}
//给大盒子对象绑定点击事件
bbox.onclick = function(e) {
    var e = e || window.event
        //获取点击对象
    var target = e.target || e.srcElement
        //判断点击的对象是否为加入购物车按钮
    if (target.innerHTML == "加入购物车") {
        //获取localStorage中的cartList3
        var cartList = localStorage.getItem("cartList3")
            //判断当前获取的cartList是否存在
        if (cartList) {
            //把localStorage中获取的内容转为数组对象
            cartList = JSON.parse(cartList)
            var a = 0 //判断当前添加的商品是否在localStorage中存在
                //遍历数组中所有元素啊
            cartList.forEach(item => {
                    //判断当前遍历的商品是否等于要添加的商品
                    if (item.id == dt.id) {
                        a++
                        item.wrap_number++
                    }
                })
                //判断a变量是否等于0
            if (a == 0) {
                //修改商品数量
                dt.wrap_number = 1
                    //把当前对象追加到数组中
                cartList.push(dt)
            }
            //把当前商品添加到localStorage中
            localStorage.setItem("cartList3", JSON.stringify(cartList))
        } else {
            //修改当前商品数量
            dt['wrap_number'] = 1
                //把当前商品添加到localStorage中
            localStorage.setItem("cartList3", JSON.stringify([dt]))
        }

    }
}