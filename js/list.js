//获取操作对象
var row = document.querySelector('.row');
var pagination1 = document.querySelector('.pagination');
(async function() {
    var dt = await promiseAjax({
            url: '../php/list.php',
            datatype: 'json'
        })
        //创建分页器对象
    new Pagination(pagination1, {
        pageInfo: {
            pagenum: 1,
            pagesize: 6,
            totalsize: dt.length,
            totalpage: Math.ceil(dt.length / 6)
        },
        textInfo: {
            first: '首页',
            prev: "上一页",
            next: "下一页",
            last: "尾页"
        },
        cb(m) {
            //获取当前页需要显示的数据
            var ar1 = dt.slice((m - 1) * 6, m * 6)
                //创建拼接所有数据的字符串
            var str = ''
                //遍历当前ar1数组中所有的数据
            ar1.forEach(item => {
                    str += `
                <li class="libox">
                <a href="../html/Detail.html?id=${item.id}">
                    <img src="${item.imgUrl}" alt="">
                    <h3 class="libox_name">${item.title}</h3>
                    <p class="libox_desc">${item.hot}</p>
                    <p class="libox_price">
                        <em>￥</em>
                        <span class="vm_price">${item.price}</span>
                    </p>
                </a>
            </li>
                  
                `
                })
                //把当前拼接好的字符串，添加到row盒子中
            row.innerHTML = str
        }
    })
})()