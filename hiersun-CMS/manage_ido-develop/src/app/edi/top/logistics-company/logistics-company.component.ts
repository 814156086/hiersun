import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';

declare var $: any;
const urlBase = '/edi-admin/edi-top-server';

/**
 * 物流公司映射信息
 */
interface LogisticsCompanyMapping {
  /**
   * 中台物流公司代码
   */
  tmsCompanyCode: string;
  /**
   * 中台物流公司名称
   */
  tmsCompanyName: string;
  /**
   * 淘宝物流公司代码
   */
  topCompanyCode: string;
  /**
   * 淘宝物流公司名称
   */
  topCompanyName: string;
}

interface LogisticsCompany {
  code: string;
  name: string;
}

@Component({
  selector: 'app-logistics-company',
  templateUrl: './logistics-company.component.html',
  styleUrls: ['./logistics-company.component.css']
})
export class LogisticsCompanyComponent implements OnInit {
  public availableTmsCompanies: Array<LogisticsCompany>;
  public loadingTms = false;
  public topCompanies: Array<LogisticsCompany>;
  public loadingTop = false;
  public mappings: Array<LogisticsCompanyMapping>;
  public loadingMappings = false;
  public noData = false;
  public mappingEditing: LogisticsCompanyMapping = null;
  public errorMsg = '';

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit() {
    this.loadTopCompanies();
    this.reloadGrid();
  }

  private loadTopCompanies() {
    this.loadingTop = true;
    const url = urlBase + '/edi/top/logistics-mapping/list-top';
    this.httpClient.get<Array<LogisticsCompany>>(url).subscribe({
      next: value => {
        this.topCompanies = value;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.loadingTop = false;
      }
    });
  }

  private loadAvailableTmsCompanies() {
    this.loadingTms = true;
    const url = urlBase + '/edi/top/logistics-mapping/list-tms-non-mapped';
    this.httpClient.get<Array<LogisticsCompany>>(url).subscribe({
      next: value => {
        this.availableTmsCompanies = value;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.loadingTms = false;
      }
    });
  }

  private loadMappings() {
    this.loadingMappings = true;
    const url = urlBase + '/edi/top/logistics-mapping/list';
    this.httpClient.get<LogisticsCompanyMapping[]>(url).subscribe({
      next: value => {
        this.mappings = value;
        this.noData = value.length === 0;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.loadingMappings = false;
      }
    });
  }

  reloadGrid() {
    this.loadAvailableTmsCompanies();
    this.loadMappings();
  }

  editMapping(mapping: LogisticsCompanyMapping) {
    this.errorMsg = '';
    this.mappingEditing = mapping;
  }

  saveMapping() {
    this.errorMsg = '';
    const tmsCompany: LogisticsCompany = new class implements LogisticsCompany {
      code: string;
      name: string;
    };
    if (this.mappingEditing == null) {
      const tmsCompanyCode = $('#edi-top-logistics-company-mapping-tms-selected').val();
      if (!tmsCompanyCode) {
        this.errorMsg += '请选择中台物流公司！！';
      } else {
        tmsCompany.code = tmsCompanyCode;
        tmsCompany.name = this.availableTmsCompanies.find(it => it.code === tmsCompanyCode).name;
      }
    } else {
      tmsCompany.code = this.mappingEditing.tmsCompanyCode;
      tmsCompany.name = this.mappingEditing.tmsCompanyName;
    }
    const topCompany: LogisticsCompany = new class implements LogisticsCompany {
      code: string;
      name: string;
    };
    const topCompanyCode = $('#edi-top-logistics-company-mapping-top-selected').val();
    if (!topCompanyCode) {
      this.errorMsg += '请选择淘宝物流公司！！';
    } else {
      topCompany.code = topCompanyCode;
      topCompany.name = this.topCompanies.find(it => it.code === topCompanyCode).name;
    }
    if (this.errorMsg) {
      return;
    }
    const url = urlBase + '/edi/top/logistics-mapping/add';
    this.httpClient.post(url, {
      tmsCompanyCode: tmsCompany.code,
      tmsCompanyName: tmsCompany.name,
      topCompanyCode: topCompany.code,
      topCompanyName: topCompany.name
    }).subscribe({
      next: value => {
        console.log(value);
      },
      error: err => {
        console.log(err);
      },
      complete: () => {
        this.reloadGrid();
        $('#edi-top-logistics-company-mapping-editor').modal('hide');
      }
    });
  }
}
