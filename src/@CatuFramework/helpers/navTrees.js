export function searchNavTree(nodes, matching, search = 'id') {
    for (const node of nodes) {
        if (node[search] === matching) {
            return node;
        } else if (node.children && node.children.length > 0) {
            let result = searchNavTree(node.children, matching, search);
            if (result) return result;
        }
    }
}

export function flattenTree(nodes_) {
    const nodes = [...nodes_];
    let result = [];
    for (let node in nodes) {
        let children = [];
        if (node.children && node.children.length > 0) {
            children = flattenTree(node.children);
            delete node.children;
        }
        result = [...result, node, ...children];
    }
    return result;
}
