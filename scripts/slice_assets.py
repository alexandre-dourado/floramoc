#!/usr/bin/env python3
"""
scripts/slice_assets.py
Utilitário inteligente para fatiar asset sheets, remover fundo e otimizar logos/ícones para o Flora MOC.
"""

import sys
import os
import argparse
from PIL import Image, ImageChops, ImageFilter
import numpy as np

def remove_background(img: Image.Image, threshold: int = 240, feather: int = 2) -> Image.Image:
    """
    Remove fundo branco ou sólido claro convertendo para canal Alpha transparente.
    Aplica suavização de bordas (feathering) para evitar contornos serrilhados.
    """
    img = img.convert("RGBA")
    data = np.array(img, dtype=np.float32)
    
    r, g, b, a = data[:, :, 0], data[:, :, 1], data[:, :, 2], data[:, :, 3]
    
    # Brilho / proximidade do branco
    brightness = (r + g + b) / 3.0
    
    # Máscara de transparência baseada no threshold
    alpha = np.where(brightness >= threshold, 0, 255).astype(np.uint8)
    
    # Criar imagem de máscara e suavizar borda se necessário
    mask = Image.fromarray(alpha, mode='L')
    if feather > 0:
        mask = mask.filter(ImageFilter.GaussianBlur(radius=feather))
    
    img.putalpha(mask)
    return img

def trim_transparency(img: Image.Image, padding: int = 10) -> Image.Image:
    """
    Recorta as margens transparentes vazias em volta do elemento, adicionando padding seguro.
    """
    bbox = img.getbbox()
    if not bbox:
        return img
    
    w, h = img.size
    left = max(0, bbox[0] - padding)
    top = max(0, bbox[1] - padding)
    right = min(w, bbox[2] + padding)
    bottom = min(h, bbox[3] + padding)
    
    return img.crop((left, top, right, bottom))

def process_logo(input_path: str, output_dir: str = "public/assets/branding", remove_bg: bool = True):
    """
    Processa a logo oficial: recorta bordas, opcionalmente remove fundo branco e gera webp e png.
    """
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(input_path)
    
    if remove_bg:
        img = remove_background(img)
    else:
        img = img.convert("RGBA")
        
    img = trim_transparency(img, padding=16)
    
    out_webp = os.path.join(output_dir, "logo.webp")
    out_png = os.path.join(output_dir, "logo.png")
    
    img.save(out_webp, "WEBP", quality=95)
    img.save(out_png, "PNG")
    
    # Cria também uma versão ícone compacto 128x128
    icon = img.copy()
    icon.thumbnail((128, 128), Image.Resampling.LANCZOS)
    icon.save(os.path.join(output_dir, "logo-icon.webp"), "WEBP", quality=95)
    
    print(f"✅ Logo processada com sucesso:")
    print(f"   -> {out_webp} ({img.width}x{img.height})")
    print(f"   -> {out_png}")
    print(f"   -> {os.path.join(output_dir, 'logo-icon.webp')}")

def slice_grid(
    input_path: str,
    rows: int = 2,
    cols: int = 4,
    output_dir: str = "public/assets/branding",
    names: list = None,
    remove_bg: bool = True
):
    """
    Fatia um asset sheet em uma grade de rows x cols.
    Recorta e limpa individualmente cada célula salvando em .webp otimizado.
    """
    os.makedirs(output_dir, exist_ok=True)
    img = Image.open(input_path)
    
    if remove_bg:
        img = remove_background(img)
    else:
        img = img.convert("RGBA")
        
    width, height = img.size
    cell_w = width // cols
    cell_h = height // rows
    
    default_names = [
        "cat-tree",        # Árvore
        "cat-flower",      # Flor / Ipê
        "cat-shrub",       # Arbusto
        "cat-palm",        # Palmeira
        "cat-succulent",   # Suculenta / Cacto
        "cat-herb",        # Erva / Broto
        "pin-marker",      # Marcador cartográfico
        "badge-verified"   # Selo / Verificação
    ]
    
    names = names or default_names
    count = 0
    
    print(f"✂️  Fatiando asset sheet ({width}x{height}) em grade {rows}x{cols} ({cell_w}x{cell_h} por célula)...")
    
    for r in range(rows):
        for c in range(cols):
            left = c * cell_w
            top = r * cell_h
            right = (c + 1) * cell_w
            bottom = (r + 1) * cell_h
            
            cell = img.crop((left, top, right, bottom))
            trimmed = trim_transparency(cell, padding=8)
            
            # Se a célula não estiver totalmente vazia
            if trimmed.getbbox():
                name = names[count] if count < len(names) else f"element_{count+1}"
                out_path = os.path.join(output_dir, f"{name}.webp")
                trimmed.save(out_path, "WEBP", quality=95)
                print(f"   [Célula {r+1},{c+1}] -> Salvo: {out_path} ({trimmed.width}x{trimmed.height})")
                count += 1
                
    print(f"🎉 Concluído: {count} elementos fatiados e salvos em {output_dir}/")

def main():
    parser = argparse.ArgumentParser(description="Flora MOC Asset Slicer & Processor")
    parser.add_argument("input", nargs="?", help="Caminho da imagem de entrada (asset sheet ou logo)")
    parser.add_argument("--logo", action="store_true", help="Processar como logo individual")
    parser.add_argument("--rows", type=int, default=2, help="Número de linhas do grid (padrão: 2)")
    parser.add_argument("--cols", type=int, default=4, help="Número de colunas do grid (padrão: 4)")
    parser.add_argument("--output", default="public/assets/branding", help="Diretório de saída")
    parser.add_argument("--keep-bg", action="store_true", help="Não remover fundo (manter original)")
    parser.add_argument("--names", nargs="+", help="Nomes customizados para os arquivos de saída")
    
    args = parser.parse_args()
    
    if not args.input:
        parser.print_help()
        sys.exit(1)
        
    remove_bg = not args.keep_bg
    
    if args.logo:
        process_logo(args.input, output_dir=args.output, remove_bg=remove_bg)
    else:
        slice_grid(args.input, rows=args.rows, cols=args.cols, output_dir=args.output, names=args.names, remove_bg=remove_bg)

if __name__ == "__main__":
    main()
