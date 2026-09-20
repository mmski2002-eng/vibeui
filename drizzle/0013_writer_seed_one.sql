-- Стартовые лайки сценария «Писатель»: случайный сид был накруткой,
-- оставляем один. Настоящие добавления из `favorite` не трогаем.

UPDATE "favorite_seed" SET "likes" = 1 WHERE "item_name" = 'scenario:writer';
