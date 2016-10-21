// 问题描述：parent结构的数组转化为children结构的数组(树状结构)

function tree(arr) {

    // 爬树，在tree(对象的数组)上面寻找id为leaf.id的节点，
    // 去掉leaf.parent属性再加入到该节点的children属性中
    function climb(tree, leaf) {
        for (var i = 0, len = tree.length; i < len; i ++) {
            if (tree[i].id == leaf.parent) {
                var hasChildren = tree[i].hasOwnProperty('children');
                if (!hasChildren) {
                    tree[i]['children'] = [];
                }
                var temp = {
                    id: leaf.id,
                    text: leaf.text
                }
                if (leaf.hasOwnProperty('children')) {
                    temp['children'] = leaf.children;
                }
                tree[i].children.push(temp);
                return i;
            } else if (hasChildren) {
                climb(tree[i].children, leaf);
            }
        };
    }

    // 遍历原始数组的每一个对象，有parent属性就去爬树
    for (var i = 0; i < arr.length; i ++) {
        if (arr[i].hasOwnProperty('parent')) {
            climb(arr, arr[i]);
            arr.splice(i, 1);
            i --;
        }
    };

    return arr;
}

var test = [
    {
        id: 'configEditSon',
        text: '新建儿子',
        parent: 'configEdit'
    },
    {
        id: 'config',
        text: '配置',
    },
    {
        id: 'configEdit',
        text: '新建',
        parent: 'config'
    },
    {
        id: 'configDelete',
        text: '删除',
        parent: 'config'
    },
    {
        id: 'configBro',
        text: '配置的兄弟'
    }
];

console.log(JSON.stringify(tree(test)));

// 输出
// [
//     {
//         "id": "config",
//         "text": "配置",
//         "children": [
//             {
//                 "id": "configEdit",
//                 "text": "新建",
//                 "children": [
//                     {
//                         "id": "configEditSon",
//                         "text": "新建儿子"
//                     }
//                 ]
//             },
//             {
//                 "id": "configDelete",
//                 "text": "删除"
//             }
//         ]
//     },
//     {
//         "id": "configBro",
//         "text": "配置的兄弟"
//     }
// ]
