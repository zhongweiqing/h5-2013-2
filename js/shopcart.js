const goodsInfo = [

    // {
    //     category: '声学',
    //     key: 'acoustics',
    //     goods: [

    //         {
    //             id: 1,
    //             name: 'MEIZU UR 高端定制耳机',
    //             tips: '十单元 8699起',
    //             price: 8699,
    //             selectNum: 1,
    //             imgUrl: 'images/p1.png',
    //             isSelected: true,
    //             upperLimit: 2
    //         },
    //         {
    //             id: 10,
    //             name: '魅族 POP2 真无线蓝牙耳机',
    //             tips: '皓月白',
    //             price: 399,
    //             selectNum: 2,
    //             imgUrl: 'images/p6.png',
    //             isSelected: false,
    //             upperLimit: 3
    //         },

    //     ],
    // },

    {

        category: '手机',
        key: 'smartPhone',
        goods: [

            {
                id: 2,
                name: '魅族 16Xs',
                tips: '全网通公开版 珊瑚橙 6+64GB',
                price: 1499,
                selectNum: 1,
                imgUrl: 'images/p2.png',
                isSelected: false,
                upperLimit: 3

            },
            {
                id: 3,
                name: '魅族 16s',
                tips: '全网通公开版 凝光白 6+128GB',
                price: 2699,
                selectNum: 1,
                imgUrl: 'images/p3.png',
                isSelected: false,
                upperLimit: 4

            },
            {
                id: 4,
                name: '魅族 16s Pro',
                tips: '全网通公开版 黑之秘境 8+128GB',
                price: 2999,
                selectNum: 1,
                imgUrl: 'images/p4.png',
                isSelected: false,
                upperLimit: 10

            },
            {
                id: 5,
                name: '魅族 16T',
                tips: '全网通公开版 湖光绿 8+256GB',
                price: 2499,
                selectNum: 1,
                imgUrl: 'images/p5.png',
                isSelected: false,
                upperLimit: 5

            },

        ]

    }


]


const delConfirm = {

    template: '#del-confirm',

    data() {

        return {

            isAlert: false,
            confirmInfo: {
                title: '',
                del: {
                    delCon: '',
                    isShow: false
                },
                content: '',
                cancelCon: ''
            }

        }

    },

    methods: {

        //关闭和取消按钮
        closeDelConfirm() {
            this.isAlert = false;
        },

        //删除按钮
        delSure() {
            this.$emit('del-goods');
            this.closeDelConfirm();
        },

    },


}



new Vue({

    el: '#shopcart',

    data: {

        goodsInfo,
        isSelectedAll: false,
        isEdit: true,
        willDelSingal: null,
        isShow: true,
        DOMEle: null,
        DOMInfo: null

    },

    filters: {

        polish(val, num) {
            num = num || 2;
            return '￥' + val.toFixed(num);

        }

    },

    //在实例创建完后调用
    created() {

        this.updateStatus(); //根据goodsInfo数据，设置某一个类商品的全选状态（isSelected）和全选状态（isSelectedAll）
        this.initBtnStatus(); //根据goodsInfo数据，设置isBanMinus和isBanPlus

    },

    mounted() {

        //DOM更新后执行
        this.$nextTick(() => {

            // 存储获取的DOM元素
            this.$data.DOMEle = {
                cartMain: document.querySelector('.cart-main'),
                cartFootWrap: document.querySelector('.cart-foot-wrap')
            }

            //存储DOM相关信息
            this.$data.DOMInfo = {
                cartMainInfo: {
                    offsetTop: this.DOMEle.cartMain.offsetTop,
                    height: this.DOMEle.cartMain.offsetHeight
                },
                cartFootWrapInfo: {
                    height: this.DOMEle.cartFootWrap.offsetHeight,
                    activeClass: 'fixed'
                },
                docScrollTop: document.documentElement.scrollTop || document.body.scrollTop,
                viewportH: window.innerHeight
            }

            this.adjustFootSite();
            window.addEventListener('scroll', () => {
                this.DOMInfo.docScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
                this.adjustFootSite();
            });
            window.addEventListener('resize', () => {
                this.DOMInfo.viewportH = window.innerHeight;
                this.adjustFootSite();
            });

        });

    },

    computed: {

        //总件数
        sum() {

            return this.goodsInfo.reduce((init, now) => {
                const num = now['goods'].reduce((init, item) => {
                    return init + item.selectNum;
                }, 0);
                return init + num;
            }, 0);

        },

        //已选择
        sumed() {

            return this.goodsInfo.reduce((init, now) => {
                const numed = now['goods'].reduce((init, item) => {
                    return init + (item.isSelected ? item.selectNum : 0);
                }, 0);
                return init + numed;
            }, 0);

        },

        // 合计
        totaled() {

            return this.goodsInfo.reduce((init, now) => {
                const singalTotal = now['goods'].reduce((init, item) => {
                    return init + (item.isSelected ? item.selectNum * item.price : 0);
                }, 0);
                return init + singalTotal;
            }, 0);

        },

        //是否结算
        isNoOrder() {

            return this.sumed === 0 ? true : false;

        },

    },

    methods: {

        //自适应cart-foot的位置
        adjustFootSite() {

            const DOMInfo = this.DOMInfo,
                cartFootWrap = this.DOMEle.cartFootWrap;

            if (DOMInfo.cartMainInfo.offsetTop + DOMInfo.cartMainInfo.height + DOMInfo.cartFootWrapInfo.height -
                DOMInfo.viewportH - DOMInfo.docScrollTop > 0) {
                cartFootWrap.classList.add(DOMInfo.cartFootWrapInfo.activeClass);
            } else {
                cartFootWrap.classList.remove(DOMInfo.cartFootWrapInfo.activeClass);
            }

        },

        // 初始化数量加减按钮样式
        initBtnStatus() {

            this.goodsInfo.forEach(e => {

                e.goods.forEach(item => {

                    item.isBanMinus = item.selectNum <= 1 ? true : false;
                    item.isBanPlus = item.selectNum >= item.upperLimit ? true : false;

                });

            });

        },

        // 更新全选和某类商品全选按钮状态
        updateStatus() {

            const flagArr = this.goodsInfo.map(e => {

                return e.isSelected = e.goods.every(item => item.isSelected);

            });

            this.isSelectedAll = flagArr.every(e => {

                return e

            });

        },

        // 切换编辑/完成
        toggleEdit() {
            this.isEdit = !this.isEdit;
        },

        //全选
        checkAll() {

            this.isSelectedAll = !this.isSelectedAll;

            this.goodsInfo.forEach(e => {

                e.isSelected = this.isSelectedAll;

                e.goods.forEach(item => {

                    item.isSelected = this.isSelectedAll;

                });

            });

        },

        //单个商品
        checkSingal(category, ele) {

            ele.isSelected = !ele.isSelected;

            category.isSelected = category.goods.every(item => item.isSelected);

            this.isSelectedAll = this.goodsInfo.every(e => e.isSelected);

        },

        //某一类商品
        checkCategory(ele) {

            ele.isSelected = !ele.isSelected;

            this.isSelectedAll = this.goodsInfo.every(e => e.isSelected);

            ele.goods.forEach(item => {
                item.isSelected = ele.isSelected;
            });

        },

        //适应del-confirm框内容数据
        changeConfirmData(option) {

            const delConfirmObj = this.$refs['delConfirm'];
            delConfirmObj.isAlert = true;

            if (option !== null) {

                delConfirmObj.confirmInfo = {
                    title: '删除',
                    content: '您确定删除该商品吗？',
                    del: {
                        delCon: '删除',
                        isShow: true
                    },
                    cancelCon: '取消'
                }

            } else if (this.sumed !== 0) {

                delConfirmObj.confirmInfo = {
                    title: '删除',
                    content: '您确定要删除选中的商品吗？',
                    del: {
                        delCon: '确定',
                        isShow: true
                    },
                    cancelCon: '取消'
                }

            } else {

                delConfirmObj.confirmInfo = {
                    title: '提示',
                    content: '亲~~ 请选择您要删除的商品！',
                    del: {
                        delCon: '',
                        isShow: false
                    },
                    cancelCon: '确定'
                }

            }

        },

        //弹出del-confrim框
        alertDelConfirm(kind, index) {

            this.willDelSingal = kind !== undefined && index !== undefined ? { kind, index } : null;

            this.changeConfirmData(this.willDelSingal);

        },

        // 确定删除商品
        deleteOk() {

            let willDelSingal = this.willDelSingal;

            if (willDelSingal !== null) {

                willDelSingal.kind.goods.splice(willDelSingal.index, 1);

            } else {

                this.goodsInfo.forEach(e => {
                    e.goods = e.goods.filter(item => item.isSelected === false);
                });

            }

            this.goodsInfo = this.goodsInfo.filter(e => e.goods.length !== 0);

            this.goodsInfo.length === 0 && (this.isShow = false);

            this.updateStatus();

            this.$nextTick(() => {

                this.DOMInfo.cartMainInfo.height = this.DOMEle.cartMain.offsetHeight;
                this.adjustFootSite();
            });

        },

        setNumBtnState(item) {

            if (item.selectNum <= 1) {
                item.isBanMinus = true;
                item.isBanPlus = false;
            } else if (item.selectNum >= item.upperLimit) {
                item.isBanPlus = true;
                item.isBanMinus = false;
            } else {
                item.isBanMinus = false;
                item.isBanPlus = false;
            }

        },

        // 自减
        minus(item) {

            item.selectNum--;
            item.selectNum <= 1 && (item.selectNum = 1);
            this.setNumBtnState(item);

        },

        //自加
        plus(item) {

            item.selectNum++;
            item.selectNum >= item.upperLimit && (item.selectNum = item.upperLimit);
            this.setNumBtnState(item);

        },

        inputVerify(item, ev) {

            item.timeOuter && clearTimeout(item.timeOuter);

            item.timeOuter = setTimeout(() => {

                let target = parseInt(ev.target.value.trim());

                if (target <= 1) {
                    target = 1;
                } else if (isNaN(target)) {
                    target = 1;
                } else if (target > item.upperLimit) {
                    target = item.upperLimit;
                }

                item.selectNum = ev.target.value = target;

                this.setNumBtnState(item);

            }, 500);


        }

    },

    components: {
        //del-confrim框
        delConfirm

    }

})