export function numeroPorExtenso(numero: number, isCurrency: boolean = true): string {
  if (isNaN(numero)) return '';

  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas10 = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];
  const centenas = ['', 'cento', 'duzentos', 'trezentos', 'quatrocentos', 'quinhentos', 'seiscentos', 'setecentos', 'oitocentos', 'novecentos'];

  function getGrupo(n: number): string {
    if (n === 100) return 'cem';
    let str = '';
    const c = Math.floor(n / 100);
    const d = Math.floor((n % 100) / 10);
    const u = n % 10;

    if (c > 0) str += centenas[c];
    if (d === 1) {
      if (str) str += ' e ';
      str += dezenas10[u];
      return str;
    }
    if (d > 1) {
      if (str) str += ' e ';
      str += dezenas[d];
    }
    if (u > 0) {
      if (str) str += ' e ';
      str += unidades[u];
    }
    return str;
  }

  const inteiros = Math.floor(numero);
  const centavos = Math.round((numero - inteiros) * 100);

  if (inteiros === 0 && centavos === 0) return isCurrency ? 'zero reais' : 'zero';

  let extensoInteiros = '';
  if (inteiros > 0) {
    const bilhoes = Math.floor(inteiros / 1000000000);
    const milhoes = Math.floor((inteiros % 1000000000) / 1000000);
    const milhares = Math.floor((inteiros % 1000000) / 1000);
    const unidadesSimples = inteiros % 1000;

    const partes = [];
    if (bilhoes > 0) partes.push(getGrupo(bilhoes) + (bilhoes === 1 ? ' bilhão' : ' bilhões'));
    if (milhoes > 0) partes.push(getGrupo(milhoes) + (milhoes === 1 ? ' milhão' : ' milhões'));
    if (milhares > 0) partes.push(getGrupo(milhares) + ' mil');
    if (unidadesSimples > 0) partes.push(getGrupo(unidadesSimples));

    for (let i = 0; i < partes.length; i++) {
        if (i === 0) {
            extensoInteiros += partes[i];
        } else if (i === partes.length - 1) {
            extensoInteiros += ' e ' + partes[i];
        } else {
            extensoInteiros += ', ' + partes[i];
        }
    }

    if (isCurrency) {
      extensoInteiros += inteiros === 1 ? ' real' : ' reais';
    }
  }

  let extensoCentavos = '';
  if (centavos > 0 && isCurrency) {
    extensoCentavos = getGrupo(centavos) + (centavos === 1 ? ' centavo' : ' centavos');
  }

  if (extensoInteiros && extensoCentavos) {
    return extensoInteiros + ' e ' + extensoCentavos;
  }
  return extensoInteiros || extensoCentavos;
}
