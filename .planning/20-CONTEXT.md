# Phase 20: Products & Services - Context

## Locked Decisions

1. **Catalog vs. Free-text**:
   - The Invoice/Quote builder will remain flexible. Users can still type free-text line items.
   - However, we will introduce an autocomplete dropdown/search field in the builder. Selecting a product from the catalog will automatically fill in the name, description, unit price, and unit type for that line item.

2. **Pricing Variants**:
   - We will stick to a single, base `unitPrice` per product as currently defined in the schema.
   - Users can manually override the price and quantity directly on the invoice/quote builder after selecting the product.

3. **Inventory Tracking**:
   - For items marked as `PRODUCT`, we will track inventory (`stockQuantity`).
   - We will implement automatic deduction logic: When an invoice containing catalog products is created (or transitioned out of DRAFT/CANCELLED state, to be decided in implementation), the `stockQuantity` will be automatically deducted.
   - Services do not track stock.

## Deferred / Out of Scope
- Complex pricing tiers, bulk discounts, or multi-currency pricing at the catalog level.
- Multi-warehouse inventory tracking.
