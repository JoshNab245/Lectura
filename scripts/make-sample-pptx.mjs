import { writeFileSync } from "node:fs";
import JSZip from "jszip";

function slideXml(title, bullets) {
  const paragraphs = [title, ...bullets]
    .map((text) => `<a:p><a:r><a:t>${text}</a:t></a:r></a:p>`)
    .join("");
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld><p:spTree>${paragraphs}</p:spTree></p:cSld>
</p:sld>`;
}

const zip = new JSZip();
zip.file(
  "[Content_Types].xml",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/ppt/presentation.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.presentation.main+xml"/>
  <Override PartName="/ppt/slides/slide1.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
  <Override PartName="/ppt/slides/slide2.xml" ContentType="application/vnd.openxmlformats-officedocument.presentationml.slide+xml"/>
</Types>`,
);
zip.file(
  "_rels/.rels",
  `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="ppt/presentation.xml"/>
</Relationships>`,
);
zip.file(
  "ppt/slides/slide1.xml",
  slideXml("Supply and demand", [
    "Equilibrium is where quantity demanded equals quantity supplied",
    "A price ceiling below equilibrium causes a shortage",
    "Consumer surplus: area under demand and above price",
  ]),
);
zip.file(
  "ppt/slides/slide2.xml",
  slideXml("Elasticity", [
    "Price elasticity of demand measures responsiveness of quantity to price",
    "Elastic demand: |PED| > 1",
    "Inelastic demand: |PED| < 1",
    "Revenue rises with price when demand is inelastic",
  ]),
);

const buffer = await zip.generateAsync({ type: "nodebuffer" });
writeFileSync("data/sample-econ.pptx", buffer);
console.log(`wrote ${buffer.length} bytes`);
