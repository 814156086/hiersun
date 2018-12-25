import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ItemType, Page} from '../../../structs';
import {channel} from '../constants';
import {TopItemType} from '../../structs';

declare var $: any;
const urlBase = '/edi-admin/edi-item-code-type';

@Component({
  selector: 'app-store-item-code-types',
  templateUrl: './store-item-code-types.component.html',
  styleUrls: ['./store-item-code-types.component.css']
})
export class StoreItemCodeTypesComponent implements OnInit {
  public validItemTypes: ItemType[];
  public itemTypeMap: Map<String, String> = new Map<String, String>();
  private topItemTypePage: Page<TopItemType>;
  public itemEditing: TopItemType;
  public typeValidated = true;
  private pageSize = 15;
  public loading = false;
  public noData = false;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.httpClient.get<ItemType[]>(urlBase + '/edi/item-code-types/types').subscribe({
      next: value => {
        this.validItemTypes = value.filter(it => it.type !== 'UNKNOWN');
        value.forEach(it => this.itemTypeMap.set(it.type, it.name));
      },
      error: err => {
        console.error(err);
      }
    });
    this.reloadGrid();
  }

  private currentPage() {
    if (!this.topItemTypePage) {
      return 1;
    }
    return this.topItemTypePage.currentPageNumber;
  }

  private loadItemTypes(pageNo, pageSize) {
    this.loading = true;
    this.noData = false;
    const url = '/edi-admin/edi-top-server/edi/ops/top/item-code-types/' + channel + '?page=' + pageNo + '&pageSize=' + pageSize;
    this.httpClient.get<Page<TopItemType>>(url).subscribe({
      next: value => {
        this.topItemTypePage = value;
        this.noData = this.topItemTypePage.total === 0;
        const that = this;
        $('#edi-top-store-item-code-types-pagination').pagination({
          currentPage: this.currentPage(),
          totalPage: this.topItemTypePage.totalPages,
          callback: function (current) {
            that.loadItemTypes(current, pageSize);
          }
        });
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  reloadGrid() {
    this.loadItemTypes(this.currentPage(), this.pageSize);
  }

  gridContent() {
    if (this.topItemTypePage == null) {
      return Array.of<TopItemType>();
    }
    return this.topItemTypePage.content;
  }

  editType(itemEditing: TopItemType) {
    this.typeValidated = true;
    this.itemEditing = itemEditing;
  }

  saveItemType() {
    const selectedType = $('#edi-top-store-item-code-types-editor-type-selected').val();
    if (!selectedType) {
      this.typeValidated = false;
      return;
    }
    this.typeValidated = true;
    this.httpClient.post(urlBase + '/edi/item-code-types', {
      code: this.itemEditing.outerId,
      type: selectedType
    })
      .subscribe({
        next: value => {
          console.log(value);
        },
        error: err => {
          console.error(err);
        },
        complete: () => {
          this.reloadGrid();
          $('#edi-top-store-item-code-types-editor').modal('hide');
        }
      });
  }
}
