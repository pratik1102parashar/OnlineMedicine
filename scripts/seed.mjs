import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

const storageDir = join(process.cwd(), 'storage')
await mkdir(storageDir, { recursive: true })

const users = []
const admins = []
const addresses = []

const medicines = [
  {
    id: 'med-1',
    name: 'Paracetamol 650',
    brand: 'HealthPlus',
    description: 'Effective fever and pain relief tablets with fast-acting formulation for day-to-day health needs.',
    price: 120,
    discount_percentage: 10,
    final_price: 108,
    category: 'Pain Relief',
    image: '/images/paracetamol.svg',
    stock_quantity: 45,
    requires_prescription: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'med-2',
    name: 'Vitamin C Gummies',
    brand: 'NutriLife',
    description: 'Daily immunity support gummies enriched with Vitamin C and zinc for adults and teens.',
    price: 399,
    discount_percentage: 15,
    final_price: 339.15,
    category: 'Supplements',
    image: '/images/vitamin-c.svg',
    stock_quantity: 30,
    requires_prescription: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'med-3',
    name: 'Cough Syrup DX',
    brand: 'CureFast',
    description: 'Sugar-free cough syrup designed for dry cough and throat irritation relief.',
    price: 185,
    discount_percentage: 5,
    final_price: 175.75,
    category: 'Cold & Cough',
    image: '/images/cough-syrup.svg',
    stock_quantity: 18,
    requires_prescription: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'med-4',
    name: 'Amoxicillin 500',
    brand: 'MediCore',
    description: 'Prescription antibiotic capsules for bacterial infections. Doctor consultation required.',
    price: 260,
    discount_percentage: 12,
    final_price: 228.8,
    category: 'Antibiotics',
    image: '/images/amoxicillin.svg',
    stock_quantity: 12,
    requires_prescription: true,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'med-5',
    name: 'Glucose Monitor Strips',
    brand: 'DiabeCare',
    description: 'Accurate test strips for blood glucose monitoring with compatible meters.',
    price: 699,
    discount_percentage: 8,
    final_price: 643.08,
    category: 'Diabetes Care',
    image: '/images/glucose-strips.svg',
    stock_quantity: 8,
    requires_prescription: false,
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'med-6',
    name: 'Daily Allergy Relief',
    brand: 'AirWell',
    description: 'Non-drowsy anti-allergy tablets that support 24-hour symptom management.',
    price: 249,
    discount_percentage: 20,
    final_price: 199.2,
    category: 'Allergy Care',
    image: '/images/allergy-relief.svg',
    stock_quantity: 0,
    requires_prescription: false,
    is_active: false,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  }
]

const coupons = [
  {
    id: 'coupon-1',
    code: 'SAVE10',
    description: 'Save 10% on orders above ₹500',
    discount_type: 'percentage',
    discount_value: 10,
    min_cart_value: 500,
    expires_at: '2027-01-01T00:00:00.000Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  },
  {
    id: 'coupon-2',
    code: 'MED100',
    description: 'Flat ₹100 off above ₹1200',
    discount_type: 'fixed',
    discount_value: 100,
    min_cart_value: 1200,
    expires_at: '2027-01-01T00:00:00.000Z',
    is_active: true,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z'
  }
]

const inventory = medicines.map((medicine) => ({
  medicine_id: medicine.id,
  stock_quantity: medicine.stock_quantity,
  is_active: medicine.is_active,
  updated_at: medicine.updated_at
}))

await Promise.all([
  writeFile(join(storageDir, 'users.json'), JSON.stringify(users, null, 2)),
  writeFile(join(storageDir, 'admins.json'), JSON.stringify(admins, null, 2)),
  writeFile(join(storageDir, 'addresses.json'), JSON.stringify(addresses, null, 2)),
  writeFile(join(storageDir, 'medicines.json'), JSON.stringify(medicines, null, 2)),
  writeFile(join(storageDir, 'carts.json'), JSON.stringify([], null, 2)),
  writeFile(join(storageDir, 'orders.json'), JSON.stringify([], null, 2)),
  writeFile(join(storageDir, 'coupons.json'), JSON.stringify(coupons, null, 2)),
  writeFile(join(storageDir, 'inventory.json'), JSON.stringify(inventory, null, 2)),
  writeFile(join(storageDir, 'otp.json'), JSON.stringify([], null, 2))
])

console.log('Storage seeded with medicines, coupons, inventory, and empty account data.')
