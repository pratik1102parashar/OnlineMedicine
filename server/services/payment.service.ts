import type { Order, PaymentMethod, PaymentStatus } from '../../types/entities'

interface PaymentGateway {
  process(order: Pick<Order, 'id' | 'final_amount'>): Promise<{ payment_status: PaymentStatus; reference: string }>
}

class CodPaymentGateway implements PaymentGateway {
  async process(order: Pick<Order, 'id' | 'final_amount'>) {
    return {
      payment_status: 'PENDING' as PaymentStatus,
      reference: `COD-${order.id}`
    }
  }
}

const gateways: Record<PaymentMethod, PaymentGateway> = {
  COD: new CodPaymentGateway()
}

export class PaymentService {
  async process(method: PaymentMethod, order: Pick<Order, 'id' | 'final_amount'>) {
    return gateways[method].process(order)
  }
}

export const paymentService = new PaymentService()
