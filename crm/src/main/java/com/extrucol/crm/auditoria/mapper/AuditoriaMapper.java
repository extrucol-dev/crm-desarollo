package com.extrucol.crm.auditoria.mapper;

import com.extrucol.crm.auditoria.Auditoria;
import com.extrucol.crm.auditoria.dto.response.AuditoriaResponseDTO;
import com.extrucol.crm.usuario.mapper.UsuarioMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AuditoriaMapper {

    private final UsuarioMapper usuarioMapper;

    public AuditoriaResponseDTO entidadADTO(Auditoria auditoria) {
        if (auditoria == null) return null;
        return new AuditoriaResponseDTO(
                auditoria.getId(),
                usuarioMapper.entidadADTO(auditoria.getUsuario()),
                auditoria.getValor_antiguo(),
                auditoria.getValor_nuevo(),
                auditoria.getFecha_registro()
        );
    }
}
