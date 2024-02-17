var fs = require('fs');
function readNodes(file_path) {
    var nodes = [];
    var fileData = fs.readFileSync(file_path, 'utf8');
    var lines = fileData.split('\n').slice(1); // Пропускаем заголовок
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var _a = line.split(','), number = _a[0], name_1 = _a[1];
        nodes.push({ number: parseInt(number), name: name_1 });
    }
    return nodes;
}
function readBranches(file_path) {
    var branches = [];
    var fileData = fs.readFileSync(file_path, 'utf8');
    var lines = fileData.split('\n').slice(1); // Пропускаем заголовок
    for (var _i = 0, lines_2 = lines; _i < lines_2.length; _i++) {
        var line = lines_2[_i];
        var _a = line.split(','), start_node = _a[0], end_node = _a[1], np = _a[2];
        branches.push({
            start_node: parseInt(start_node),
            end_node: parseInt(end_node),
            np: parseInt(np),
        });
    }
    return branches;
}
function buildGraph(nodes, branches) {
    var _a, _b;
    var graph = new Map();
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var node = nodes_1[_i];
        graph.set(node.number, []);
    }
    for (var _c = 0, branches_1 = branches; _c < branches_1.length; _c++) {
        var branch = branches_1[_c];
        var start_node = branch.start_node, end_node = branch.end_node;
        (_a = graph.get(start_node)) === null || _a === void 0 ? void 0 : _a.push(end_node);
        (_b = graph.get(end_node)) === null || _b === void 0 ? void 0 : _b.push(start_node);
    }
    return graph;
}
function findSegments(graph) {
    var segments = [];
    var visited = new Set();
    function dfs(node, segment) {
        visited.add(node);
        segment.push(node);
        for (var _i = 0, _a = graph.get(node) || []; _i < _a.length; _i++) {
            var neighbor = _a[_i];
            if (!visited.has(neighbor)) {
                dfs(neighbor, segment);
            }
        }
    }
    for (var _i = 0, _a = graph.keys(); _i < _a.length; _i++) {
        var node = _a[_i];
        if (!visited.has(node)) {
            var segment = [];
            dfs(node, segment);
            segments.push(segment);
        }
    }
    return segments.map(function (segment) { return segment.length; }).sort(function (a, b) { return b - a; });
}
function main(nodes_file, branches_file) {
    var nodes = readNodes(nodes_file);
    var branches = readBranches(branches_file);
    var graph = buildGraph(nodes, branches);
    var segments = findSegments(graph);
    var segments_count = segments.length;
    var segment_sizes = segments.join(', ');
    console.log('Количество сегментов сети:', segments_count);
    console.log('Количество элементов в каждом сегменте:', segment_sizes);
}
var nodes_file = './nodes.csv';
var branches_file = './branches.csv';
main(nodes_file, branches_file);
