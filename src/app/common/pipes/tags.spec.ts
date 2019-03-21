import { TestBed } from "@angular/core/testing";
import { TagsPipe } from './tags';
import { FeaturesService } from "../../services/features.service";
import { MockService } from "../../utils/mock";

describe('TagPipe', () => {

  let featuresServiceMock:any = MockService(FeaturesService, {
    has: (feature) => { return true; }
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TagsPipe],
      providers: [
        {
          provide: FeaturesService,
          useValue: featuresServiceMock,
        },
      ],
    });
  });

  it('should transform when # in the middle ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=name;period=24h');
  });

  it('should transform when # preceded by space ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring #name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=name;period=24h');
  });

  it('should transform when # preceded by [] ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring [#name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=name;period=24h');
  });

  it('should transform when # preceded by () ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring (#name)';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=name;period=24h');
  });


  it('should correctly parse when duplicates substrings present', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = '#hash #hashlonger';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=hash;period=24h');
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=hashlonger;period=24h');
  });

  it('should transform when @ preceded by () ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring (@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform when @ preceded by [] ', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring [@name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform when @ preceded by space', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring @name';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a class="tag"');
  });

  it('should transform to an email', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring@name.com';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="mailto:textstring@name.com"');
  });

  it('should not transform when @ not present', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring name';
    const transformedString = pipe.transform(<any>string);

    expect(transformedString).toEqual(string);
    expect(transformedString).not.toContain('<a class="tag"');
  });

  it('should transform url http', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring http://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="http://minds.com/');
  });

  it('should transform url with https', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring https://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="https://minds.com/');
  });

  it('should transform url with ftp', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring ftp://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="ftp://minds.com/');
  });

  it('should transform url with file', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'textstring file://minds.com/';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('<a href="file://minds.com/');
  });

  it('should transform url with a hashtag', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'text http://minds.com/#position';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('text <a href="http://minds.com/#position"');
  });

  it('should transform url with a hashtag and @', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = 'text http://minds.com/#position@some';
    const transformedString = pipe.transform(<any>string);
    expect(transformedString).toContain('text <a href="http://minds.com/#position@some"');
  });

  it('should transform many tags', () => {
    const pipe = new TagsPipe(featuresServiceMock);
    const string = `text http://minds.com/#position@some @name
    @name1 #hash1#hash2 #hash3 ftp://s.com name@mail.com
    `;
    const transformedString = pipe.transform(<any>string);

    expect(transformedString).toContain('<a href="http://minds.com/#position@some"');
    expect(transformedString).toContain('<a class="tag" href="/name"');
    expect(transformedString).toContain('<a class="tag" href="/name1"');
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=hash1;period=24h');
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=hash2;period=24h');
    expect(transformedString).toContain('<a href="/newsfeed/global/top;hashtag=hash3;period=24h');
    expect(transformedString).toContain('<a href="ftp://s.com"');
    expect(transformedString).toContain('<a href="mailto:name@mail.com"');
  });
});
