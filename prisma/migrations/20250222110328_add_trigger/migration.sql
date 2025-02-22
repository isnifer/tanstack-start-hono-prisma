-- This is an empty migration.

-- Create function to calculate user balance
CREATE OR REPLACE FUNCTION calculate_user_balance(user_id TEXT)
RETURNS BIGINT AS $$
BEGIN
    RETURN COALESCE(
        (SELECT SUM(amount)
        FROM "WalletTransaction"
        WHERE "userId" = user_id),
        0
    );
END;
$$ LANGUAGE plpgsql;

-- Create function to update user balance
CREATE OR REPLACE FUNCTION update_user_balance()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE "user"
    SET balance = calculate_user_balance(NEW."userId")
    WHERE id = NEW."userId";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after insert on WalletTransaction
CREATE TRIGGER update_user_balance_trigger
    AFTER INSERT ON "WalletTransaction"
    FOR EACH ROW
    EXECUTE FUNCTION update_user_balance();
