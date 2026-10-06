export function normalizeBook(raw) {
    return {
        ...raw, 
        price_gbp: Number(raw.price_text.replace(/[^0-9.]/g, ''))
    }
}