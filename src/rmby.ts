import { IRemove } from "./api/api-interface";
import { IRemoveBy } from "./api/api-interface";
import { FilterState } from "./filters/filter-interface";
import { RemoveBy } from "./api/api";
import { DirFilter } from "./filters/filters";

export class RemoveFiles implements IRemove {
  private filterState: FilterState[] = [];

  constructor() {
    this.filterState = [];
  }

  from(dirPath: string): IRemoveBy {
    this.filterState.push(new DirFilter(dirPath));
    return new RemoveBy(this.filterState);
  }
}
