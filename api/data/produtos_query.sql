-- Query para obter os produtos com suas categorias, ingredientes e avaliações
SELECT i.id_item AS id_item,
    i.nome AS nome,
    r.nome AS restaurante,
    r.id_restaurante AS id_restaurante,
    c.nome AS categoria,
    c.id_categoria AS id_categoria,
    i.descricao AS descricao,
    AVG(p.avaliacao) AS avaliacao,
    i.estoque AS estoque,
    i.preco AS preco,
    i.preco_especial AS preco_especial,
    i.imagem AS imagem
FROM item i
    INNER JOIN categoria c ON i.id_categoria = c.id_categoria
    INNER JOIN restaurante r ON i.id_restaurante = r.id_restaurante
    LEFT JOIN item_pedido ip ON i.id_item = ip.id_item
    LEFT JOIN pedido p ON ip.id_pedido = p.id_pedido
    AND p.avaliacao IS NOT NULL
GROUP BY i.id_item,
    i.nome,
    r.nome,
    r.id_restaurante,
    c.nome,
    c.id_categoria,
    i.descricao,
    i.estoque,
    i.preco,
    i.preco_especial,
    i.imagem
ORDER BY i.nome;