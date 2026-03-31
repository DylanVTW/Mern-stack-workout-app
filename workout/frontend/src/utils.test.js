import { optellen, isVolwassen } from "./utils";

test('Optellen telt twee getallen op', () => {
    const getal1 = 5;
    const getal2 = 3;

    const resultaat = optellen(getal1, getal2);


    expect(resultaat).toBe(8);
});

test('isVolwassen geeft true voor 18+', () => {

    const resultaat = isVolwassen(20);

    expect (resultaat).toBe(true);
});

test('isVolwassesn geeft false voor onder 18', () => {
    const resultaat = isVolwassen(16);
    expect (resultaat).toBe(false);
})