-- Query para obter os produtos com suas categorias, ingredientes e avaliações
SELECT i.id_item AS id,
    i.nome AS nome,
    r.nome AS restaurante,
    r.id_restaurante AS restaurante_id,
    c.nome AS categoria,
    c.id_categoria AS categoria_id,
    i.descricao AS descricao,
    ARRAY_AGG(DISTINCT ing.nome) FILTER (WHERE ing.nome IS NOT NULL) AS ingredientes,
    ARRAY_AGG(DISTINCT ing.id_ingrediente) FILTER (WHERE ing.id_ingrediente IS NOT NULL) AS ingredientes_ids,
    i.preco AS preco,
    i.preco_especial AS preco_especial,
    AVG(p.avaliacao) AS avaliacao,
    i.imagem AS imagem_url
FROM item i
    INNER JOIN categoria c ON i.id_categoria = c.id_categoria
    INNER JOIN restaurante r ON i.id_restaurante = r.id_restaurante
    LEFT JOIN item_ingrediente ii ON i.id_item = ii.id_item
    LEFT JOIN ingrediente ing ON ii.id_ingrediente = ing.id_ingrediente
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
    i.preco,
    i.preco_especial,
    i.imagem
ORDER BY i.nome;