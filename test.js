const fs = require('fs');

function readNodes(file_path) {
  const nodes = [];
  const fileData = fs.readFileSync(file_path, 'utf8');
  const lines = fileData.split('\n').slice(1); // Пропускаем заголовок
  for (const line of lines) {
    const [number, name] = line.split(',');
    nodes.push({ number: parseInt(number), name });
  }
  return nodes;
}

function readBranches(file_path) {
  const branches = [];
  const fileData = fs.readFileSync(file_path, 'utf8');
  const lines = fileData.split('\n').slice(1); // Пропускаем заголовок
  for (const line of lines) {
    const [start_node, end_node, np] = line.split(',');
    branches.push({
      start_node: parseInt(start_node),
      end_node: parseInt(end_node),
      np: parseInt(np),
    });
  }
  return branches;
}

function buildGraph(nodes, branches) {
  const graph = new Map();
  for (const node of nodes) {
    graph.set(node.number, []);
  }
  for (const branch of branches) {
    const { start_node, end_node } = branch;
    graph.get(start_node)?.push(end_node);
    graph.get(end_node)?.push(start_node);
  }
  return graph;
}

function findSegments(graph) {
  const segments = [];
  const visited = new Set();

  function dfs(node, segment) {
    visited.add(node);
    segment.push(node);
    for (const neighbor of graph.get(node) || []) {
      if (!visited.has(neighbor)) {
        dfs(neighbor, segment);
      }
    }
  }

  for (const node of graph.keys()) {
    if (!visited.has(node)) {
      const segment = [];
      dfs(node, segment);
      segments.push(segment);
    }
  }

  return segments.map((segment) => segment.length).sort((a, b) => b - a);
}

function main(nodes_file, branches_file) {
  const nodes = readNodes(nodes_file);
  const branches = readBranches(branches_file);
  const graph = buildGraph(nodes, branches);
  const segments = findSegments(graph);

  const segments_count = segments.length;
  const segment_sizes = segments.join(', ');

  console.log('Количество сегментов сети:', segments_count);
  console.log('Количество элементов в каждом сегменте:', segment_sizes);
}

const nodes_file = './nodes.csv';
const branches_file = './branches.csv';

main(nodes_file, branches_file);