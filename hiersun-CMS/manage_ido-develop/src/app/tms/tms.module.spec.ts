import { TmsModule } from './tms.module';

describe('TmsModule', () => {
  let tmsModule: TmsModule;

  beforeEach(() => {
    tmsModule = new TmsModule();
  });

  it('should create an instance', () => {
    expect(tmsModule).toBeTruthy();
  });
});
