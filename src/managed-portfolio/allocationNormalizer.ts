import { Injectable } from '@nestjs/common';

interface Allocation {
  instrumentId: string;
  target: number;
}

@Injectable()
export class AllocationNormalizer {
  private fundAllocation(allocations: Allocation[]) {
    return +allocations
      .map(({ target }) => +target.toFixed(4))
      .reduce((sum, target) => sum + target, 0)
      .toFixed(4);
  }

  private biasAllocations(allocations: Allocation[], bias: number) {
    return allocations.map((allocation, index) =>
      index !== 0
        ? allocation
        : {
            ...allocation,
            target: allocation.target + bias,
          }
    );
  }

  public normaliseWeights(allocations: Allocation[]) {
    const allocation = this.fundAllocation(allocations);

    if (allocation === 1) {
      return allocations;
    }

    const normalisedAllocations = [...allocations].sort(
      ({ target: target1 }, { target: target2 }) => target2 - target1
    );

    return this.normaliseWeights(
      this.biasAllocations(
        normalisedAllocations,
        allocation < 1 ? 0.0001 : -0.0001
      )
    );
  }
}
